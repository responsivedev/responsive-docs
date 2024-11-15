import {
    IconAlertHexagon,
    IconArrowRight,
    IconArrowUpRight,
    IconAsteriskSimple, IconBolt,
    IconBulb,
    IconCalendar,
    IconCheck,
    IconChevronLeft,
    IconChevronRight, IconCloud, IconDatabaseSmile, IconFile,
    IconHeartFilled,
    IconInfoCircle,
    IconLineDashed,
    IconLink,
    IconLoader2,
    IconMapPinFilled,
    IconMenu,
    IconNews,
    IconNotebook, IconPointFilled,
    IconShieldCheck, IconTerminal2,
    IconX,
} from "@tabler/icons-react";
import React from "react";

interface IconProps {
    size?: number,
    className?: string,
    width?: number,
    height?: number,
}

export const Icons = {
    alert: IconAlertHexagon,
    arrowRight: IconArrowRight,
    arrowUpRight: IconArrowUpRight,
    asterisk: IconAsteriskSimple,
    bolt: IconBolt,
    bulb: IconBulb,
    calendar: IconCalendar,
    check: IconCheck,
    chevronLeft: IconChevronLeft,
    chevronRight: IconChevronRight,
    cloud: IconCloud,
    dash: IconLineDashed,
    dbSmile: IconDatabaseSmile,
    file: IconFile,
    heart: IconHeartFilled,
    info: IconInfoCircle,
    link: IconLink,
    loader: IconLoader2,
    mapPin: IconMapPinFilled,
    menu: IconMenu,
    note: IconNotebook,
    pointFilled: IconPointFilled,
    post: IconNews,
    shieldCheck: IconShieldCheck,
    terminal: IconTerminal2,
    x: IconX,
    linkedin: ({...props}: IconProps) => <svg
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={props.width || props.size}
        height={props.height || props.size}
        {...props}
    >
        <g clipPath="url(#clip0_3774_70975)">
            <path
                d="M18.5236 0H1.47639C1.08483 0 0.709301 0.155548 0.432425 0.432425C0.155548 0.709301 0 1.08483 0 1.47639V18.5236C0 18.9152 0.155548 19.2907 0.432425 19.5676C0.709301 19.8445 1.08483 20 1.47639 20H18.5236C18.9152 20 19.2907 19.8445 19.5676 19.5676C19.8445 19.2907 20 18.9152 20 18.5236V1.47639C20 1.08483 19.8445 0.709301 19.5676 0.432425C19.2907 0.155548 18.9152 0 18.5236 0ZM5.96111 17.0375H2.95417V7.48611H5.96111V17.0375ZM4.45556 6.1625C4.11447 6.16058 3.7816 6.05766 3.49895 5.86674C3.21629 5.67582 2.99653 5.40544 2.8674 5.08974C2.73826 4.77404 2.70554 4.42716 2.77336 4.09288C2.84118 3.7586 3.0065 3.4519 3.24846 3.21148C3.49042 2.97107 3.79818 2.80772 4.13289 2.74205C4.4676 2.67638 4.81426 2.71133 5.12913 2.84249C5.44399 2.97365 5.71295 3.19514 5.90205 3.47901C6.09116 3.76288 6.19194 4.09641 6.19167 4.4375C6.19488 4.66586 6.15209 4.89253 6.06584 5.104C5.97959 5.31547 5.85165 5.50742 5.68964 5.66839C5.52763 5.82936 5.33487 5.95607 5.12285 6.04096C4.91083 6.12585 4.68389 6.16718 4.45556 6.1625ZM17.0444 17.0458H14.0389V11.8278C14.0389 10.2889 13.3847 9.81389 12.5403 9.81389C11.6486 9.81389 10.7736 10.4861 10.7736 11.8667V17.0458H7.76667V7.49306H10.6583V8.81667H10.6972C10.9875 8.22917 12.0042 7.225 13.5556 7.225C15.2333 7.225 17.0458 8.22083 17.0458 11.1375L17.0444 17.0458Z"
                fill="currentColor"></path>
        </g>
        <defs>
            <clipPath id="clip0_3774_70975">
                <rect width="20" height="20" fill="white"></rect>
            </clipPath>
        </defs>
    </svg>,
    close: IconX,
    discord: ({...props}: IconProps) => <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 127.14 96.36"
        width={props.width || props.size}
        height={props.height || props.size}
        {...props}
    >
        <path
            fill="currentColor"
            d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
    </svg>,
    hackerNews: ({...props}: IconProps) => <svg
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={props.width || props.size}
        height={props.height || props.size}
        {...props}
    >
        <g clipPath="url(#clip0_3774_70975)">
            <path
                d="m0 0h24v24h-24zm12.8 13.446 4.339-8.303h-1.871q-2.143 4.018-2.839 5.786l-.375.96-.32-.75c-.96-2.374-1.931-4.348-3.022-6.243l.129.243h-1.984l4.286 8.2v5.52h1.657z"
                fill="black"></path>
        </g>
        <defs>
            <clipPath id="clip0_3774_70975">
                <rect width="20" height="20" fill="white"></rect>
            </clipPath>
        </defs>
    </svg>,
    logo: ({...props}: IconProps) => <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1791.53 266.68"
        width={props.width || props.size}
        height={props.height || props.size}
        {...props}
    >
        <path d="m258.35 51.37-80.3 105.41L0 51.37h258.35z" fill="#ff781d"/>
        <path d="m178.05 156.78-71.97 94.53 152.27-46.99V51.37l-80.3 105.41z" fill="#f1945c"/>
        <path
            d="M343.18 74.4c8.95-19.35 25.18-29.03 48.7-29.03v28.41c-13.32-.62-24.77 2.92-34.34 10.61-9.57 7.7-14.36 20.09-14.36 37.15v82.72h-27.16V48.18h27.16V74.4ZM434.32 138.7c2.7 13.94 9.1 24.77 19.2 32.46 10.09 7.7 22.52 11.55 37.3 11.55 20.6 0 35.58-7.59 44.95-22.79l23.1 13.11c-15.19 23.52-38.08 35.27-68.67 35.27-24.77 0-44.9-7.75-60.4-23.25-15.51-15.5-23.25-35.12-23.25-58.84s7.59-43.08 22.79-58.69c15.19-15.6 34.85-23.41 58.99-23.41 22.89 0 41.57 8.07 56.03 24.19 14.46 16.13 21.7 35.54 21.7 58.22 0 3.95-.31 8.01-.93 12.17H434.34Zm54-68.98c-14.57 0-26.64 4.11-36.21 12.33-9.58 8.22-15.51 19.2-17.8 32.93h104.26c-2.29-14.77-8.12-26.01-17.48-33.71-9.37-7.7-20.29-11.55-32.78-11.55ZM620.67 89.86c0 5.9 3.06 10.63 9.19 14.2 6.13 3.56 13.43 6.59 21.91 9.08s17.01 5 25.59 7.52c8.58 2.52 15.84 7.24 21.79 14.17 5.94 6.93 8.92 15.82 8.92 26.68 0 14.15-5.46 25.49-16.39 34.02-10.92 8.53-24.92 12.8-41.99 12.8-15.19 0-28.2-3.33-39.02-9.99-10.82-6.66-18.52-15.5-23.1-26.53l23.41-13.42c2.5 7.49 7.18 13.42 14.05 17.79 6.87 4.37 15.09 6.56 24.66 6.56 8.95 0 16.33-1.71 22.16-5.14 5.82-3.43 8.74-8.78 8.74-16.05 0-6.02-3.03-10.85-9.06-14.49-6.04-3.64-13.31-6.73-21.78-9.27-8.48-2.55-17.01-5.11-25.59-7.68-8.58-2.58-15.88-7.19-21.92-13.85-6.04-6.66-9.05-15.19-9.05-25.59 0-13.53 5.26-24.66 15.77-33.4 10.5-8.74 23.67-13.11 39.49-13.11 12.69 0 23.98 2.87 33.87 8.59 9.88 5.72 17.33 13.68 22.32 23.88l-22.79 12.8c-5.62-13.31-16.75-19.98-33.4-19.98-7.7 0-14.26 1.78-19.66 5.34-5.42 3.56-8.12 8.6-8.12 15.11ZM820.13 44.12c21.85 0 40.47 7.96 55.87 23.88 15.4 15.92 23.1 35.33 23.1 58.22s-7.7 42.29-23.1 58.21c-15.4 15.92-34.02 23.88-55.87 23.88-25.81 0-45.47-10.3-59-30.9v89.27h-27.16V48.18h27.16v26.85c13.53-20.6 33.19-30.9 59-30.9Zm-3.43 137.97c15.6 0 28.72-5.35 39.33-16.07s15.92-23.98 15.92-39.8-5.31-29.08-15.92-39.8C845.42 75.7 832.3 70.34 816.7 70.34s-29.03 5.36-39.64 16.08c-10.61 10.72-15.92 23.99-15.92 39.8s5.31 29.08 15.92 39.8c10.61 10.72 23.82 16.07 39.64 16.07ZM1063.29 184.59c-16.03 15.82-35.48 23.72-58.37 23.72s-42.29-7.91-58.21-23.72c-15.92-15.81-23.88-35.27-23.88-58.37s7.96-42.56 23.88-58.37c15.92-15.81 35.32-23.73 58.21-23.73s42.34 7.91 58.37 23.73c16.02 15.82 24.04 35.27 24.04 58.37s-8.02 42.56-24.04 58.37Zm-58.37-2.81c15.61 0 28.71-5.31 39.33-15.92 10.61-10.61 15.92-23.82 15.92-39.64s-5.31-29.03-15.92-39.64-23.72-15.92-39.33-15.92-28.4 5.31-39.02 15.92-15.92 23.83-15.92 39.64 5.31 29.03 15.92 39.64 23.62 15.92 39.02 15.92ZM1190.96 44.12c18.31 0 32.98 5.78 44.01 17.33 11.03 11.55 16.55 27.21 16.55 46.98v95.83h-27.16v-94.27c0-12.69-3.43-22.52-10.3-29.5-6.87-6.97-16.34-10.46-28.41-10.46-13.53 0-24.45 4.21-32.77 12.64-8.33 8.43-12.49 21.38-12.49 38.86v82.72h-27.16V48.18h27.16v22.48c11.03-17.68 27.88-26.53 50.57-26.53ZM1306.45 89.86c0 5.9 3.06 10.63 9.19 14.2 6.13 3.56 13.43 6.59 21.92 9.08 8.48 2.49 17.01 5 25.59 7.52 8.58 2.52 15.84 7.24 21.78 14.17 5.95 6.93 8.92 15.82 8.92 26.68 0 14.15-5.46 25.49-16.39 34.02-10.92 8.53-24.92 12.8-41.98 12.8-15.19 0-28.2-3.33-39.02-9.99-10.82-6.66-18.52-15.5-23.1-26.53l23.41-13.42c2.49 7.49 7.18 13.42 14.04 17.79 6.87 4.37 15.08 6.56 24.66 6.56 8.94 0 16.33-1.71 22.16-5.14 5.83-3.43 8.74-8.78 8.74-16.05 0-6.02-3.03-10.85-9.06-14.49-6.04-3.64-13.31-6.73-21.78-9.27-8.48-2.55-17.01-5.11-25.58-7.68-8.58-2.58-15.89-7.19-21.92-13.85-6.04-6.66-9.05-15.19-9.05-25.59 0-13.53 5.25-24.66 15.76-33.4s23.67-13.11 39.49-13.11c12.69 0 23.99 2.87 33.87 8.59 9.88 5.72 17.32 13.68 22.32 23.88l-22.79 12.8c-5.62-13.31-16.75-19.98-33.4-19.98-7.7 0-14.26 1.78-19.66 5.34s-8.11 8.6-8.11 15.11ZM1419.76 48.18h27.16v156.08h-27.16zM1597.68 48.18h29.34l-62.43 156.08h-31.83l-62.43-156.08h29.34l49.01 126.72 49.01-126.72ZM1659.8 138.7c2.7 13.94 9.1 24.77 19.19 32.46 10.09 7.7 22.53 11.55 37.3 11.55 20.6 0 35.58-7.59 44.95-22.79l23.1 13.11c-15.19 23.52-38.08 35.27-68.68 35.27-24.77 0-44.9-7.75-60.4-23.25-15.51-15.5-23.26-35.12-23.26-58.84s7.59-43.08 22.79-58.69c15.19-15.6 34.86-23.41 59-23.41 22.88 0 41.56 8.07 56.03 24.19 14.46 16.13 21.69 35.54 21.69 58.22 0 3.95-.31 8.01-.94 12.17h-130.79Zm54-68.98c-14.57 0-26.64 4.11-36.21 12.33-9.57 8.22-15.5 19.2-17.79 32.93h104.25c-2.29-14.77-8.11-26.01-17.48-33.71-9.36-7.7-20.29-11.55-32.77-11.55ZM1419.76 0h27.16v27.16h-27.16z"
            fill="#00e16"/>
    </svg>,
    github: ({...props}: IconProps) => (
        <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="github"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 496 512"
            width={props.width || props.size}
            height={props.height || props.size}
            {...props}
        >
            <path
                fill="currentColor"
                d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
            ></path>
        </svg>
    ),
    twitter: ({...props}: IconProps) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width={props.width || props.size}
            height={props.height || props.size}
            viewBox="0 0 50 50"
            {...props}>
            <path
                fill="currentColor"
                d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z"></path>
        </svg>
    )
}
