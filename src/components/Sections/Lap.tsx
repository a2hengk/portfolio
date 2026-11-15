"use client";

import { useState } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { CHECKPOINTS, TRACK_PATH, TRACK_VIEWBOX, type CheckpointId } from "@/data/nordschleife";
import { fill } from "@/i18n/config";
import styles from "./Path.module.css";

type PathDict = Dictionary["home"]["path"];

// The current station is where the lap is right now.
const CURRENT: CheckpointId = 7;

// Map on the left, stations on the right. Both drive the same state: a
// checkpoint on the map opens its station in the list and the other way
// round.
export default function Lap({ dict }: { dict: PathDict }) {
    const [active, setActive] = useState<CheckpointId>(CURRENT);

    return (
        <div className={`glass rv ${styles.panel}`}>
            <div className={styles.mapCol}>
                <div className={styles.map}>
                    <svg viewBox={TRACK_VIEWBOX} role="img" aria-label={dict.mapAria}>
                        <defs>
                            <path id="nordschleife" d={TRACK_PATH} />
                        </defs>
                        <use href="#nordschleife" className={styles.base} />
                        <use href="#nordschleife" className={styles.draw} />
                        <use href="#nordschleife" className={styles.runner} />
                    </svg>
                    {CHECKPOINTS.map((cp) => (
                        <button
                            key={cp.id}
                            type="button"
                            className={`${styles.cp} ${active === cp.id ? styles.on : ""}`}
                            style={{ left: `${cp.left}%`, top: `${cp.top}%` }}
                            aria-label={fill(dict.checkpointAria, { id: cp.id, corner: cp.corner })}
                            aria-pressed={active === cp.id}
                            aria-controls={`station-${cp.id}`}
                            onClick={() => setActive(cp.id)}
                        >
                            <span>{cp.id}</span>
                        </button>
                    ))}
                </div>
                <p className={`mut ${styles.caption}`}>{dict.caption}</p>
            </div>

            <ol className={styles.stations}>
                {CHECKPOINTS.map((cp) => {
                    const milestone = dict.milestones[String(cp.id) as keyof PathDict["milestones"]];
                    const on = active === cp.id;

                    return (
                        <li key={cp.id} className={`${styles.st} ${on ? styles.on : ""}`}>
                            <button
                                type="button"
                                className={styles.stBtn}
                                aria-expanded={on}
                                aria-controls={`station-${cp.id}`}
                                onClick={() => setActive(cp.id)}
                            >
                                <span className={styles.stNo}>{cp.id}</span>
                                <span className={styles.stName}>
                                    <span className={styles.stTitle}>{milestone.title}</span>
                                    <span className={styles.stCorner}>{cp.corner}</span>
                                </span>
                                <span className={styles.stYear}>
                                    {cp.id === CURRENT ? <span className="dot live" aria-hidden="true" /> : null}
                                    <span>{milestone.year}</span>
                                </span>
                            </button>
                            <div id={`station-${cp.id}`} className={styles.stBody} aria-hidden={!on}>
                                <div>
                                    <p>{milestone.text}</p>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}
