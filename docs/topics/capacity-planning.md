import OssCaution from './_oss-caution.md';

# Capacity Planning

<OssCaution />

## Do I Need More RocksDB Memory?

When reading state, Kafka Streams reads from a series of caches. It first 
checks its record cache, then reads from RocksDB. RocksDB has its own 
cache for both search metadata (indexes and bloom filters) and data. If 
it doesn’t find what it needs in its cache, RocksDB reads from disk. 
Disk reads first look in the OS page cache before doing actual IO. 

<div style={{'text-align': 'center'}}>
<img src="/img/caching-layers.png" width="240" />
</div>

You want to try to get a sense for how good of a hit rate you’re getting. 
Unfortunately, it’s actually quite difficult to measure the hit rate 
specifically — so you’ll need to rely on a few indirect indicators:

1. To look at the hit rate from the Kafka Streams cache, you could look 
   at the `hit-ratio metric`. Note that this is recorded at DEBUG level 
   only, so you’ll need to turn that on if you want to look at the hit rate. 
2. RocksDB exposes its cache hit rates. You can look at 
   `block-cache-data-hit-ratio`, `block-cache-index-hit-ratio`, and 
   `block-cache-filter-hit-ratio` Kafka Streams metrics to get hit rates for 
   data blocks, index, and bloom filters, respectively. These were added in 
   [KIP-471](https://cwiki.apache.org/confluence/display/KAFKA/KIP-471).
   Especially if you’ve configured RocksDB to pin index and filter blocks in cache, 
   you should expect the latter two ratios to be high. Again, these are also 
   only exposed at `DEBUG` level.
3. To get a feel for your page cache usage, you can look at the memory used by 
   the operating system to cache disk blocks. On Linux, you can use the command 
   `free -mh` and look at the value under the cache column. In cases where you’re 
   getting poor cache hit rates, you’d expect to see a lot of memory used by the 
   cache. Note the inverse of that statement is not true — you could have lots of 
   cache with a high hit rate — so you’ll need to take this indicator combined 
   with the next one.
4. Finally, look at disk IOPS activity (e.g. using `iostat` on linux) - in 
   particular the number of disk reads per second.

## Do I Need More JVM Heap?

Finally, you might see the application spending a large percentage of time in GC 
pauses (you can check using [`jstat`](https://docs.oracle.com/javase/8/docs/technotes/tools/windows/jstat.html) 
or enabling gc logging). In this case, you may need a bigger heap or to tune your GC.

## Do I Need More Disk?

It’s possible that your workload either just has a really big working set that 
you can’t cache, or just needs a lot of write capacity.  You can tell if you 
went through the steps above, tried the recommended tuning, and didn’t see an 
improvement and/or still observed lots of disk I/O and high disk utilization.

In that case you’ll need more throughput from your disks. Depending on the 
environment you’re running in you may be able to achieve this by adding capacity 
to your disk. For example, in AWS you can either provision more IOPS directly 
(piops volumes) or provision a larger volume (gp volumes), depending on your 
volume type. Just make sure you’re still within the disk 
[network limit](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-optimized.html).

Or you might be able to add volumes and RAID.

<hr/>

For more context, see our blog post on 
[Sizing Kafka Streams](https://www.responsive.dev/blog/a-size-for-every-stream)
