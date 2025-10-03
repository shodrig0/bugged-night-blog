// Base Cosmic object interface
export interface CosmicObject {
    id: string;
    slug: string;
    title: string;
    content?: string;
    metadata: Record<string, any>;
    type: string;
    created_at: string;
    modified_at: string;
}

// Character types
export type CharacterRole = 'assassin' | 'hunter' | 'survivor';
export type CharacterDifficulty = 'easy' | 'medium' | 'hard';

export interface CharacterSkill {
    name: string;
    description: string;
    cooldown: string;
}

export interface CharacterSkin {
    name: string;
    rarity: string;
}

export interface Character extends CosmicObject {
    type: 'characters';
    metadata: {
        content?: string;
        role?: {
            key: CharacterRole;
            value: string;
        };
        health_points?: number;
        speed?: number;
        special_ability?: string;
        difficulty?: {
            key: CharacterDifficulty;
            value: string;
        };
        character_image?: {
            url: string;
            imgix_url: string;
        };
        skills?: CharacterSkill[];
        available_skins?: CharacterSkin[];
    };
}

// Tournament types
export type TournamentStatus = 'upcoming' | 'live' | 'finished';

export interface Tournament extends CosmicObject {
    type: 'tournaments';
    metadata: {
        content?: string;
        status?: {
            key: TournamentStatus;
            value: string;
        };
        start_date?: string;
        end_date?: string;
        prize_pool?: string;
        max_participants?: number;
        tournament_banner?: {
            url: string;
            imgix_url: string;
        };
        registration_link?: string;
        winner?: string;
        participants_count?: number;
    };
}

// Patch Note types
export type PatchType = 'major' | 'bugfix' | 'balance' | 'newcontent';

export interface BalanceChange {
    character: string;
    description: string;
}

export interface NewFeature {
    name: string;
    description: string;
}

export interface PatchNote extends CosmicObject {
    type: 'patch-notes';
    metadata: {
        content?: string;
        release_date?: string;
        patch_type?: {
            key: PatchType;
            value: string;
        };
        balance_changes?: BalanceChange[];
        bug_fixes?: string[];
        new_features?: NewFeature[];
        download_size?: string;
    };
}

// Player Ranking types
export type PlayerRegion = 'na' | 'eu' | 'latam' | 'asia';

export interface PlayerRanking extends CosmicObject {
    type: 'player-rankings';
    metadata: {
        rank_position?: number;
        total_wins?: number;
        total_matches?: number;
        win_rate?: number;
        favorite_character?: string;
        region?: {
            key: PlayerRegion;
            value: string;
        };
        season?: string;
        points?: number;
        player_avatar?: {
            url: string;
            imgix_url: string;
        };
    };
}

// Game Map types
export type MapSize = 'small' | 'medium' | 'large';
export type MapEnvironment = 'urban' | 'forest' | 'industrial' | 'desert';
export type MapDifficulty = 'easy' | 'medium' | 'hard';

export interface MapFeature {
    name: string;
    description: string;
}

export interface GameMap extends CosmicObject {
    type: 'game-maps';
    metadata: {
        content?: string;
        map_image?: {
            url: string;
            imgix_url: string;
        };
        size?: {
            key: MapSize;
            value: string;
        };
        environment?: {
            key: MapEnvironment;
            value: string;
        };
        max_players?: number;
        special_features?: MapFeature[];
        difficulty?: {
            key: MapDifficulty;
            value: string;
        };
        release_date?: string;
    };
}

// News types
export type NewsCategory = 'news' | 'event' | 'maintenance' | 'community';
export type NewsPriority = 'normal' | 'important' | 'critical';

export interface News extends CosmicObject {
    type: 'news';
    metadata: {
        content?: string;
        publication_date?: string;
        category?: {
            key: NewsCategory;
            value: string;
        };
        featured_image?: {
            url: string;
            imgix_url: string;
        };
        author?: string;
        priority?: {
            key: NewsPriority;
            value: string;
        };
        related_link?: string;
    };
}

// API Response types
export interface CosmicResponse<T> {
    objects: T[];
    total: number;
}