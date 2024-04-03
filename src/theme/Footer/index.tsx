import React from 'react';

import {Icons} from "../../components/icons"

export function Footer() :  JSX.Element | null {
  return (
      <footer>
        <div className={'flex flex-col w-full space-y-1 mx-auto pt-3 pb-3 border-0 border-t border-solid border-gray-300'}>
          <div className="flex items-center justify-between px-6 w-full">
            <div className={"flex space-x-2"}>
              <Icons.logo className={'w-24 h-5'} size={32}/>
              <a href={'mailto:info@responsive.dev'} className={'text-sm text-neutral-400'}>
                info@responsive.dev
              </a>
            </div>
            <div className={'flex space-x-2'}>
              <a href={'https://twitter.com/responsive_apps'} target={'_blank'} aria-label="Twitter">
                <Icons.twitter className="text-neutral-400" size={18}/>
              </a>
              <a href={'https://discord.gg/jEk8JvjJrg'} target={'_blank'} aria-label="Discord">
                <Icons.discord className="text-neutral-400" size={18}/>
              </a>
              <a href={'https://github.com/responsivedev'} target={'_blank'} aria-label="Github">
                <Icons.github className="text-neutral-400" size={18}/>
              </a>
              <a href={'https://www.linkedin.com/company/responsivedev'} target={'_blank'} aria-label="Github">
                <Icons.linkedin className="text-neutral-400" size={18}/>
              </a>
            </div>
          </div>
          <div className="flex flex-row justify-between px-6 w-full gap-4">
            <p className={'text-xs text-neutral-400'}>© 2024 Responsive Computing, Inc.</p>
          </div>
        </div>
      </footer>
  )
}

export default React.memo(Footer);
