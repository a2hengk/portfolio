import { asc } from "drizzle-orm";
import { db } from "@/db";
import { reactionScores } from "@/db/schema";
import { LEADERBOARD_SIZE } from "./reaction-constants";

export type LeaderboardEntry = {
    id: string;
    displayName: string;
    reactionMs: number;
};

export async function getLeaderboard(limit = LEADERBOARD_SIZE): Promise<LeaderboardEntry[]> {
    return db
        .select({
            id: reactionScores.id,
            displayName: reactionScores.displayName,
            reactionMs: reactionScores.reactionMs,
        })
        .from(reactionScores)
        // Ties go to whoever set the time first.
        .orderBy(asc(reactionScores.reactionMs), asc(reactionScores.updatedAt))
        .limit(limit);
}
