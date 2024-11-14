// src/theme/DocCardList/index.js
import React from 'react';
import { useCurrentSidebarCategory } from '@docusaurus/theme-common';
import styles from './customDocCardList.module.css';

export default function CustomDocCardList(props) {
    const category = useCurrentSidebarCategory();

    if (!category) {
        return null;
    }

    return (
        <div>
            <ul>
                {category.items.map((item) => (
                    <li key={item.label}>
                        <a href={item.href} style={{ textDecoration: 'underline' }}>
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
