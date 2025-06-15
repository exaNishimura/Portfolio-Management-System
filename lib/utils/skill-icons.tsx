import { IconType } from 'react-icons';
// フロントエンド・JavaScript関連
import { 
  SiReact, 
  SiNextdotjs, 
  SiVuedotjs, 
  SiAngular, 
  SiSvelte,
  SiJavascript,
  SiTypescript,
  SiHtml5,
  SiCss3,
  SiSass,
  SiTailwindcss,
  SiBootstrap,
  SiJquery
} from 'react-icons/si';

// バックエンド・プログラミング言語
import {
  SiNodedotjs,
  SiExpress,
  SiNestjs,
  SiPython,
  SiDjango,
  SiFlask,
  SiFastapi,
  SiPhp,
  SiLaravel,
  SiRuby,
  SiRubyonrails,
  SiSpring,
  SiSharp,
  SiDotnet,
  SiGo,
  SiRust
} from 'react-icons/si';

// データベース
import {
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiSqlite,
  SiFirebase,
  SiSupabase,
  SiPrisma
} from 'react-icons/si';

// クラウド・インフラ
import {
  SiAmazon,
  SiGooglecloud,
  SiDocker,
  SiKubernetes,
  SiVercel,
  SiNetlify,
  SiHeroku
} from 'react-icons/si';

// モバイル
import {
  SiFlutter,
  SiSwift,
  SiKotlin,
  SiIonic
} from 'react-icons/si';

// ツール・その他
import {
  SiGit,
  SiGithub,
  SiGitlab,
  SiWebpack,
  SiVite,
  SiBabel,
  SiEslint,
  SiPrettier,
  SiJest,
  SiCypress,
  SiStorybook,
  SiFigma,
  SiAdobephotoshop,
  SiAdobeillustrator,
  SiAdobepremierepro
} from 'react-icons/si';

// OS・システム
import {
  SiLinux,
  SiUbuntu,
  SiApple,
  SiNginx,
  SiApache
} from 'react-icons/si';

// 汎用アイコン（React Icons - Lucide）
import { 
  LuCode,           // デフォルトコードアイコン
  LuTerminal,       // ターミナル・CLI関連
  LuCpu,            // システム・ハードウェア関連
  LuDatabase,       // データベース関連
  LuGlobe,          // Web関連
  LuLayers,         // アーキテクチャ・レイヤー関連
  LuSettings,       // 設定・ツール関連
  LuWrench,         // 開発ツール関連
  LuZap,            // パフォーマンス・高速処理関連
  LuBox,            // パッケージ・モジュール関連
  LuComponent,      // コンポーネント関連
  LuFileCode,       // ファイル・コード関連
  LuPuzzle,         // プラグイン・拡張関連
  LuWorkflow        // ワークフロー・プロセス関連
} from 'react-icons/lu';

// Font Awesome アイコン
import { 
  FaWordpress,
  FaCode,           // 汎用コードアイコン
  FaCog,            // 設定・ツール
  FaDatabase,       // データベース
  FaServer,         // サーバー関連
  FaCloud,          // クラウド関連
  FaMobile,         // モバイル関連
  FaDesktop,        // デスクトップ関連
  FaGlobe,          // Web関連
  FaTools,          // 開発ツール
  FaCubes,          // モジュール・パッケージ
  FaLayerGroup,     // レイヤー・アーキテクチャ
  FaBolt,           // パフォーマンス
  FaPuzzlePiece,    // プラグイン・拡張
  FaRocket          // デプロイ・起動
} from 'react-icons/fa';

// スキル名とアイコンのマッピング
const skillIconMap: Record<string, IconType> = {
  // フロントエンド
  'react': SiReact,
  'next.js': SiNextdotjs,
  'nextjs': SiNextdotjs,
  'vue.js': SiVuedotjs,
  'vue': SiVuedotjs,
  'angular': SiAngular,
  'svelte': SiSvelte,
  'javascript': SiJavascript,
  'typescript': SiTypescript,
  'html': SiHtml5,
  'html5': SiHtml5,
  'css': SiCss3,
  'css3': SiCss3,
  'sass': SiSass,
  'scss': SiSass,
  'tailwind': SiTailwindcss,
  'tailwindcss': SiTailwindcss,
  'bootstrap': SiBootstrap,
  'jquery': SiJquery,
  
  // バックエンド
  'node.js': SiNodedotjs,
  'nodejs': SiNodedotjs,
  'express': SiExpress,
  'nest.js': SiNestjs,
  'nestjs': SiNestjs,
  'python': SiPython,
  'django': SiDjango,
  'flask': SiFlask,
  'fastapi': SiFastapi,
  'php': SiPhp,
  'laravel': SiLaravel,
  'ruby': SiRuby,
  'rails': SiRubyonrails,
  'spring': SiSpring,
  'c#': SiSharp,
  'csharp': SiSharp,
  '.net': SiDotnet,
  'dotnet': SiDotnet,
  'go': SiGo,
  'golang': SiGo,
  'rust': SiRust,
  
  // データベース
  'mysql': SiMysql,
  'postgresql': SiPostgresql,
  'postgres': SiPostgresql,
  'mongodb': SiMongodb,
  'redis': SiRedis,
  'sqlite': SiSqlite,
  'firebase': SiFirebase,
  'supabase': SiSupabase,
  'prisma': SiPrisma,
  
  // クラウド・インフラ
  'aws': SiAmazon,
  'azure': SiGooglecloud, // Azureアイコンが見つからないため、代替として使用
  'gcp': SiGooglecloud,
  'google cloud': SiGooglecloud,
  'docker': SiDocker,
  'kubernetes': SiKubernetes,
  'vercel': SiVercel,
  'netlify': SiNetlify,
  'heroku': SiHeroku,
  
  // モバイル
  'react native': SiReact,
  'flutter': SiFlutter,
  'swift': SiSwift,
  'kotlin': SiKotlin,
  'ionic': SiIonic,
  
  // ツール・その他
  'git': SiGit,
  'github': SiGithub,
  'gitlab': SiGitlab,
  'webpack': SiWebpack,
  'vite': SiVite,
  'babel': SiBabel,
  'eslint': SiEslint,
  'prettier': SiPrettier,
  'jest': SiJest,
  'cypress': SiCypress,
  'storybook': SiStorybook,
  'figma': SiFigma,
  'photoshop': SiAdobephotoshop,
  'illustrator': SiAdobeillustrator,
  'premiere pro': SiAdobepremierepro,
  'premiere': SiAdobepremierepro,
  'premierepro': SiAdobepremierepro,
  
  // OS・システム
  'linux': SiLinux,
  'ubuntu': SiUbuntu,
  'macos': SiApple,
  'nginx': SiNginx,
  'apache': SiApache,
  
  // CMS・その他
  'wordpress': FaWordpress,
};

// スキル名を正規化する関数（大文字小文字、スペース、ドットを統一）
function normalizeSkillName(skill: string): string {
  return skill
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/\./g, '')
    .replace(/-/g, '')
    .replace(/_/g, '')
    .trim();
}

// スキルの別名・略称マッピング
const skillAliases: Record<string, string[]> = {
  'react': ['reactjs', 'react.js'],
  'next.js': ['nextjs', 'next'],
  'vue.js': ['vue', 'vuejs'],
  'angular': ['angularjs'],
  'javascript': ['js', 'ecmascript'],
  'typescript': ['ts'],
  'node.js': ['nodejs', 'node'],
  'express': ['expressjs'],
  'nest.js': ['nestjs', 'nest'],
  'postgresql': ['postgres', 'pg'],
  'mongodb': ['mongo'],
  'premiere pro': ['premiere', 'premierepro', 'adobe premiere', 'adobe premiere pro'],
  'photoshop': ['ps', 'adobe photoshop'],
  'illustrator': ['ai', 'adobe illustrator'],
  'c#': ['csharp', 'c sharp'],
  '.net': ['dotnet', 'dot net'],
  'react native': ['reactnative', 'rn'],
  'ruby on rails': ['rails', 'ror'],
  'tailwindcss': ['tailwind', 'tailwind css'],
  'bootstrap': ['bs'],
  'jquery': ['jq'],
  'google cloud': ['gcp', 'google cloud platform'],
  'amazon web services': ['aws'],
  'kubernetes': ['k8s'],
  'docker': ['containerization'],
  'git': ['version control'],
  'github': ['gh'],
  'gitlab': ['gl'],
  'visual studio code': ['vscode', 'vs code'],
  'intellij': ['intellij idea'],
  'sublime text': ['sublime'],
  'atom': ['atom editor'],
  'wordpress': ['wp', 'word press']
};

// 別名から正規名を取得する関数
function getCanonicalSkillName(skill: string): string {
  const normalizedInput = normalizeSkillName(skill);
  
  // 直接マッピングにある場合
  if (skillIconMap[normalizedInput]) {
    return normalizedInput;
  }
  
  // 別名から検索
  for (const [canonical, aliases] of Object.entries(skillAliases)) {
    if (aliases.some(alias => normalizeSkillName(alias) === normalizedInput)) {
      return canonical;
    }
  }
  
  return normalizedInput;
}

// スキルに対応するアイコンを取得する関数
export function getSkillIcon(skill: string): IconType {
  // 1. 正規名を取得（別名対応）
  const canonicalName = getCanonicalSkillName(skill);
  
  // 2. 完全一致を試す
  if (skillIconMap[canonicalName]) {
    return skillIconMap[canonicalName];
  }
  
  // 3. 正規化した入力で再試行
  const normalizedSkill = normalizeSkillName(skill);
  if (skillIconMap[normalizedSkill]) {
    return skillIconMap[normalizedSkill];
  }
  
  // 4. 部分一致を試す（入力が登録名に含まれる）
  for (const [key, icon] of Object.entries(skillIconMap)) {
    if (key.includes(normalizedSkill)) {
      return icon;
    }
  }
  
  // 5. 逆部分一致を試す（登録名が入力に含まれる）
  for (const [key, icon] of Object.entries(skillIconMap)) {
    if (normalizedSkill.includes(key)) {
      return icon;
    }
  }
  
  // 6. ファジー検索（類似度チェック）
  const fuzzyMatch = findFuzzyMatch(normalizedSkill);
  if (fuzzyMatch) {
    return skillIconMap[fuzzyMatch];
  }
  
  // 7. デフォルトアイコン（汎用的なコードアイコン）
  return LuCode;
}

// ファジー検索（類似度チェック）
function findFuzzyMatch(input: string): string | null {
  const threshold = 0.7; // 類似度の閾値
  let bestMatch: string | null = null;
  let bestScore = 0;
  
  for (const key of Object.keys(skillIconMap)) {
    const score = calculateSimilarity(input, key);
    if (score > threshold && score > bestScore) {
      bestScore = score;
      bestMatch = key;
    }
  }
  
  return bestMatch;
}

// 文字列の類似度を計算（Levenshtein距離ベース）
function calculateSimilarity(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  
  if (len1 === 0) return len2 === 0 ? 1 : 0;
  if (len2 === 0) return 0;
  
  const matrix: number[][] = [];
  
  // 初期化
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }
  
  // 計算
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,     // 削除
        matrix[i][j - 1] + 1,     // 挿入
        matrix[i - 1][j - 1] + cost // 置換
      );
    }
  }
  
  const distance = matrix[len1][len2];
  const maxLen = Math.max(len1, len2);
  return 1 - distance / maxLen;
}

// スキル検索の詳細情報を取得する関数（デバッグ用）
export function getSkillSearchInfo(skill: string): {
  originalInput: string;
  normalizedInput: string;
  canonicalName: string;
  matchType: 'exact' | 'canonical' | 'normalized' | 'partial' | 'reverse-partial' | 'fuzzy' | 'default';
  matchedKey?: string;
  similarity?: number;
  icon: IconType;
} {
  const originalInput = skill;
  const normalizedInput = normalizeSkillName(skill);
  const canonicalName = getCanonicalSkillName(skill);
  
  // 完全一致（正規名）
  if (skillIconMap[canonicalName]) {
    return {
      originalInput,
      normalizedInput,
      canonicalName,
      matchType: 'canonical',
      matchedKey: canonicalName,
      icon: skillIconMap[canonicalName]
    };
  }
  
  // 完全一致（正規化）
  if (skillIconMap[normalizedInput]) {
    return {
      originalInput,
      normalizedInput,
      canonicalName,
      matchType: 'normalized',
      matchedKey: normalizedInput,
      icon: skillIconMap[normalizedInput]
    };
  }
  
  // 部分一致
  for (const [key, icon] of Object.entries(skillIconMap)) {
    if (key.includes(normalizedInput)) {
      return {
        originalInput,
        normalizedInput,
        canonicalName,
        matchType: 'partial',
        matchedKey: key,
        icon
      };
    }
  }
  
  // 逆部分一致
  for (const [key, icon] of Object.entries(skillIconMap)) {
    if (normalizedInput.includes(key)) {
      return {
        originalInput,
        normalizedInput,
        canonicalName,
        matchType: 'reverse-partial',
        matchedKey: key,
        icon
      };
    }
  }
  
  // ファジー検索
  const fuzzyMatch = findFuzzyMatch(normalizedInput);
  if (fuzzyMatch) {
    const similarity = calculateSimilarity(normalizedInput, fuzzyMatch);
    return {
      originalInput,
      normalizedInput,
      canonicalName,
      matchType: 'fuzzy',
      matchedKey: fuzzyMatch,
      similarity,
      icon: skillIconMap[fuzzyMatch]
    };
  }
  
  // デフォルト
  return {
    originalInput,
    normalizedInput,
    canonicalName,
    matchType: 'default',
    icon: LuCode
  };
}

// 利用可能なスキル一覧を取得する関数
export function getAvailableSkills(): string[] {
  const skills = new Set<string>();
  
  // 直接マッピングされたスキル
  Object.keys(skillIconMap).forEach(skill => skills.add(skill));
  
  // 別名も含める
  Object.entries(skillAliases).forEach(([canonical, aliases]) => {
    skills.add(canonical);
    aliases.forEach(alias => skills.add(alias));
  });
  
  return Array.from(skills).sort();
}

// スキルアイコンコンポーネント
interface SkillIconProps {
  skill: string;
  size?: number;
  className?: string;
  debug?: boolean; // デバッグ情報をコンソールに出力
}

export function SkillIcon({ skill, size = 16, className = '', debug = false }: SkillIconProps) {
  const IconComponent = getSkillIcon(skill);
  
  if (debug) {
    const searchInfo = getSkillSearchInfo(skill);
    console.log(`スキル検索情報 - ${skill}:`, searchInfo);
  }
  
  return (
    <IconComponent 
      size={size} 
      className={className}
      aria-label={`${skill}のアイコン`}
    />
  );
} 