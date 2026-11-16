import type { Dictionary } from "@/app/[lang]/dictionaries";
import Orb from "@/components/Layout/Orb";
import Lap from "./Lap";
import styles from "./Path.module.css";

export default function PathSection({ dict }: { dict: Dictionary["home"]["path"] }) {
    return (
        <section id="path" className="sec">
            <Orb color="light" size="clamp(280px, 44vw, 660px)" opacity={0.3} left="10%" top="26%" duration={38} />
            <Orb color="dark" size="clamp(240px, 36vw, 520px)" opacity={0.85} right="-4%" bottom="2%" duration={46} delay={-20} />

            <div className="wrap">
                <h2 className="disp h2 rv">{dict.title}</h2>
                <p className={`mut rv ${styles.lead}`}>{dict.text}</p>
                <Lap dict={dict} />
            </div>
        </section>
    );
}
