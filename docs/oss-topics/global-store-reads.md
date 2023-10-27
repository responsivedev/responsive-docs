import OssCaution from './_oss-caution.md';

# Missing Data From GlobalKTable

<OssCaution />

If you are attempting to read from a Global Store and are not getting the
expected results, one of the following explanations may be the cause:

## Modifying Data Before Inserting

During restoration `GlobalKTables` read data directly from a source topic and
insert them into the store. While the API makes it seem like you can process
and modify the data before inserting it into the store, the store will get
wiped out when the global store goes through restoration and instead will
exactly reflect the data in the underlying topic.

For example, consider the following event in Kafka which has the following
key and value, both serialized as JSON:
```json
key: {"key": "foo"}
value: {"some": "value"}
```
If you "strip" the key and instead insert only `store.put("foo", {"some":
"value"})`, the key will exist as `"foo"` before restoration and as 
`{"key": "foo"}` after restoration.

## Serialization Issues

If you are able to retrieve the key by iterating all the data in the
state store (`ReadOnlyKeyValueStore#all()` and comparing the result with the
key you expect) but cannot retrieve the key through a direct retrieval
(`ReadOnlyKeyValueStore#get`) you should make sure that the serializer you
are using to read is identical to the serializer you are using to insert
the data.
