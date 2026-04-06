"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
    return (
        <header>
            <div>
                <Image
                    src="/profil.png"
                    alt="Profile Picture"
                    width={50}
                    height={60}
                />
                <h1>Heyy I'm Lunas!</h1>
                <nav>
                    <ul>
                        <li><Link href="/">Home</Link>
                        </li>
                        <li><Link href="/about">About</Link>
                        </li>
                        <li><Link href="/projects">Projects</Link>
                        </li>
                        <li><Link href="/contact">Contact</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );          
}