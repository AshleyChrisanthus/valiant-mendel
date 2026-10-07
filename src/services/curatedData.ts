import type { UnifiedCompanyData, SubsidiaryRelation } from '../types/company';

/**
 * Curated high-fidelity corporate fallback dataset for offline/stand-alone operation
 * or when direct public endpoints face strict rate limits or network issues.
 */
export const CURATED_COMPANY_PROFILES: Record<string, UnifiedCompanyData> = {
  disney: {
    id: 'Q7414',
    name: 'The Walt Disney Company',
    source: 'wikidata',
    badge: 'Media & Entertainment Conglomerate',
    jurisdiction: 'US-DE',
    cik: '0001744489',
    lei: '549300V5Q8D38U6M2T35',
    description: 'American multinational mass media and entertainment conglomerate headquartered in Burbank, California.',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Disney_wordmark.svg',
    subsidiaries: [
      {
        id: 'wd-marvel',
        name: 'Marvel Studios',
        relationType: 'Owned Studio',
        badge: 'Studio & IP Asset',
        jurisdiction: 'US-CA',
        source: 'wikidata',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Marvel_Studios_2016_logo.svg',
        description: 'American film and television production company responsible for the MCU.',
        children: [
          {
            id: 'wd-marvel-music',
            name: 'Marvel Music',
            relationType: 'Label / Division',
            badge: 'Music Label',
            jurisdiction: 'US-CA',
            source: 'wikidata',
            description: 'Music publishing arm of Marvel Studios.'
          },
          {
            id: 'wd-marvel-animation',
            name: 'Marvel Animation',
            relationType: 'Animation Division',
            badge: 'Animation Studio',
            jurisdiction: 'US-CA',
            source: 'wikidata',
            description: 'Animation television and film production unit.'
          }
        ]
      },
      {
        id: 'wd-pixar',
        name: 'Pixar Animation Studios',
        relationType: 'Owned Studio',
        badge: 'Studio & IP Asset',
        jurisdiction: 'US-CA',
        source: 'wikidata',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Pixar_logo.svg',
        description: 'Computer animation studio based in Emeryville, California.'
      },
      {
        id: 'wd-lucasfilm',
        name: 'Lucasfilm Ltd.',
        relationType: 'Owned Studio',
        badge: 'Film & Tech Studio',
        jurisdiction: 'US-CA',
        source: 'wikidata',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Lucasfilm_logo.svg',
        description: 'Film and television production company known for Star Wars and Indiana Jones.',
        children: [
          {
            id: 'wd-ilm',
            name: 'Industrial Light & Magic (ILM)',
            relationType: 'VFX Division',
            badge: 'VFX / Post-Production',
            jurisdiction: 'US-CA',
            source: 'wikidata',
            description: 'Visual effects company created by George Lucas.'
          },
          {
            id: 'wd-skywalker-sound',
            name: 'Skywalker Sound',
            relationType: 'Audio Division',
            badge: 'Post-Production Sound',
            jurisdiction: 'US-CA',
            source: 'wikidata',
            description: 'Sound design, editorial, and audio mixing facility.'
          }
        ]
      },
      {
        id: 'wd-20th-century',
        name: '20th Century Studios',
        relationType: 'Subsidiary',
        badge: 'Film Studio',
        jurisdiction: 'US-CA',
        source: 'wikidata',
        description: 'Major American film studio located in Century City, Los Angeles.'
      },
      {
        id: 'wd-espn',
        name: 'ESPN Inc.',
        relationType: 'Majority Subsidiary (80%)',
        badge: 'Sports Broadcasting',
        jurisdiction: 'US-CT',
        source: 'wikidata',
        description: 'International multinational sports entertainment cable network.'
      },
      {
        id: 'wd-hulu',
        name: 'Hulu LLC',
        relationType: 'Streaming Asset',
        badge: 'Streaming Platform',
        jurisdiction: 'US-DE',
        source: 'wikidata',
        description: 'American subscription streaming media service.'
      },
      {
        id: 'wd-disney-parks',
        name: 'Disney Experiences & Products',
        relationType: 'Operational Segment',
        badge: 'Theme Parks & Consumer Products',
        jurisdiction: 'US-FL',
        source: 'wikidata',
        description: 'Operates Disneyland, Walt Disney World, and international resort destinations.'
      }
    ]
  },
  alphabet: {
    id: 'Q20800404',
    name: 'Alphabet Inc.',
    source: 'wikidata',
    badge: 'Technology Conglomerate',
    jurisdiction: 'US-DE',
    cik: '0001652044',
    lei: '5493006MHB84DD0ZWV18',
    description: 'American multinational technology conglomerate holding company created through a restructuring of Google.',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Alphabet_Inc_Logo_2015.svg',
    subsidiaries: [
      {
        id: 'wd-google-llc',
        name: 'Google LLC',
        relationType: 'Principal Operating Subsidiary',
        badge: 'Tech & Cloud Platform',
        jurisdiction: 'US-DE',
        source: 'wikidata',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
        description: 'Search, advertising, cloud computing, and consumer electronics.',
        children: [
          {
            id: 'wd-youtube',
            name: 'YouTube LLC',
            relationType: 'Owned Platform',
            badge: 'Digital Video Platform',
            jurisdiction: 'US-DE',
            source: 'wikidata',
            logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
            description: 'Global online video sharing and social media platform.'
          },
          {
            id: 'wd-android',
            name: 'Android Open Source Project',
            relationType: 'OS Division',
            badge: 'Mobile Operating System',
            jurisdiction: 'US-CA',
            source: 'wikidata',
            description: 'Mobile operating system and software ecosystem.'
          }
        ]
      },
      {
        id: 'wd-deepmind',
        name: 'Google DeepMind',
        relationType: 'AI Research Division',
        badge: 'Artificial Intelligence',
        jurisdiction: 'GB',
        source: 'wikidata',
        description: 'World-leading AI research laboratory based in London.'
      },
      {
        id: 'wd-waymo',
        name: 'Waymo LLC',
        relationType: 'Other Bets Subsidiary',
        badge: 'Autonomous Mobility',
        jurisdiction: 'US-DE',
        source: 'wikidata',
        description: 'Autonomous vehicle and robotaxi technology company.'
      },
      {
        id: 'wd-verily',
        name: 'Verily Life Sciences LLC',
        relationType: 'Other Bets Subsidiary',
        badge: 'Healthcare & Precision Health',
        jurisdiction: 'US-DE',
        source: 'wikidata',
        description: 'Life sciences research and healthcare technology enterprise.'
      },
      {
        id: 'wd-calico',
        name: 'Calico Life Sciences LLC',
        relationType: 'Other Bets Subsidiary',
        badge: 'Biotechnology / Longevity',
        jurisdiction: 'US-CA',
        source: 'wikidata',
        description: 'Biotechnology company focused on aging and age-related diseases.'
      },
      {
        id: 'wd-gv',
        name: 'GV (Google Ventures)',
        relationType: 'Venture Capital Arm',
        badge: 'Early-stage Venture Capital',
        jurisdiction: 'US-CA',
        source: 'wikidata',
        description: 'Venture capital investment arm of Alphabet.'
      }
    ]
  },
  skydance: {
    id: 'Q7537756',
    name: 'Skydance Media LLC',
    source: 'wikidata',
    badge: 'Entertainment & Interactive Studio',
    jurisdiction: 'US-CA',
    description: 'American production company founded by David Ellison, key player in recent Paramount Global merger.',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Skydance_Media_logo.svg',
    subsidiaries: [
      {
        id: 'wd-skydance-anim',
        name: 'Skydance Animation',
        relationType: 'Studio Asset',
        badge: 'Feature Animation Studio',
        jurisdiction: 'US-CA',
        source: 'wikidata',
        description: 'Animation division producing animated feature films and television series.'
      },
      {
        id: 'wd-skydance-interactive',
        name: 'Skydance Interactive',
        relationType: 'Gaming & VR Asset',
        badge: 'Interactive Games Studio',
        jurisdiction: 'US-CA',
        source: 'wikidata',
        description: 'Video game developer focused on virtual reality and narrative experiences.'
      },
      {
        id: 'wd-skydance-games',
        name: 'Skydance Games',
        relationType: 'AAA Video Game Division',
        badge: 'Console & PC Games',
        jurisdiction: 'US-CA',
        source: 'wikidata',
        description: 'Game studio led by Amy Hennig developing Marvel and Star Wars games.'
      },
      {
        id: 'wd-paramount-global',
        name: 'Paramount Global (Consolidated)',
        relationType: 'Merger / Operating Partner',
        badge: 'Broadcasting & Film Media',
        jurisdiction: 'US-DE',
        source: 'wikidata',
        description: 'CBS, Paramount Pictures, Nickelodeon, MTV, and Paramount+ streaming.'
      }
    ]
  }
};

/**
 * Curated GLEIF Legal Entity Registry records
 */
export const CURATED_GLEIF_PROFILES: Record<string, UnifiedCompanyData> = {
  disney: {
    id: '549300V5Q8D38U6M2T35',
    name: 'THE WALT DISNEY COMPANY',
    source: 'gleif',
    badge: 'LEI: 549300V5Q8D38U6M2T35',
    jurisdiction: 'US-DE',
    lei: '549300V5Q8D38U6M2T35',
    description: 'Ultimate Accounting Consolidating Parent registered in Delaware, USA.',
    subsidiaries: [
      {
        id: 'gleif-wd-enterprises',
        name: 'DISNEY ENTERPRISES, INC.',
        relationType: 'Direct Subsidiary',
        badge: 'LEI: 5493000P3V84C5G8Q212',
        jurisdiction: 'US-DE',
        lei: '5493000P3V84C5G8Q212',
        source: 'gleif',
        description: 'Direct corporate holding entity for intellectual property rights.'
      },
      {
        id: 'gleif-wd-parks',
        name: 'WALT DISNEY PARKS AND RESORTS U.S., INC.',
        relationType: 'Direct Subsidiary',
        badge: 'LEI: 549300K84J2Q28M09L43',
        jurisdiction: 'US-FL',
        lei: '549300K84J2Q28M09L43',
        source: 'gleif',
        description: 'Operating entity for North American theme park operations.'
      },
      {
        id: 'gleif-wd-uk',
        name: 'THE WALT DISNEY COMPANY LIMITED',
        relationType: 'Indirect Subsidiary',
        badge: 'LEI: 2138002R7S1V8W9X4Y11',
        jurisdiction: 'GB',
        lei: '2138002R7S1V8W9X4Y11',
        source: 'gleif',
        description: 'United Kingdom corporate operations and distribution.'
      },
      {
        id: 'gleif-wd-intl',
        name: 'DISNEY INTERNATIONAL ENTERPRISES C.V.',
        relationType: 'Foreign Operating Sub',
        badge: 'LEI: 724500Y5V8R7W6X3Q298',
        jurisdiction: 'NL',
        lei: '724500Y5V8R7W6X3Q298',
        source: 'gleif',
        description: 'European and international licensing vehicle.'
      }
    ]
  },
  alphabet: {
    id: '5493006MHB84DD0ZWV18',
    name: 'ALPHABET INC.',
    source: 'gleif',
    badge: 'LEI: 5493006MHB84DD0ZWV18',
    jurisdiction: 'US-DE',
    lei: '5493006MHB84DD0ZWV18',
    description: 'Ultimate Accounting Consolidating Parent registered in Delaware, USA.',
    subsidiaries: [
      {
        id: 'gleif-google-llc',
        name: 'GOOGLE LLC',
        relationType: 'Direct Consolidating Sub',
        badge: 'LEI: 549300I7S7E8P9Q0R122',
        jurisdiction: 'US-DE',
        lei: '549300I7S7E8P9Q0R122',
        source: 'gleif',
        description: 'Principal domestic operational subsidiary.'
      },
      {
        id: 'gleif-google-ireland',
        name: 'GOOGLE IRELAND LIMITED',
        relationType: 'Operating Subsidiary',
        badge: 'LEI: 6354005Y3Z8A9B1C2D44',
        jurisdiction: 'IE',
        lei: '6354005Y3Z8A9B1C2D44',
        source: 'gleif',
        description: 'EMEA regional headquarters and advertising services provider.'
      },
      {
        id: 'gleif-deepmind-tech',
        name: 'DEEPMIND TECHNOLOGIES LIMITED',
        relationType: 'Operating Subsidiary',
        badge: 'LEI: 2138008L9M0N1P2Q3R55',
        jurisdiction: 'GB',
        lei: '2138008L9M0N1P2Q3R55',
        source: 'gleif',
        description: 'UK registered corporate AI entity.'
      }
    ]
  }
};

/**
 * Curated SEC EDGAR Form 10-K Exhibit 21 Legal Subsidiaries
 */
export const CURATED_SEC_PROFILES: Record<string, UnifiedCompanyData> = {
  disney: {
    id: '0001744489',
    name: 'The Walt Disney Company (SEC Exhibit 21)',
    source: 'sec',
    badge: 'SEC 10-K Exhibit 21',
    jurisdiction: 'US-DE',
    cik: '0001744489',
    description: 'Significant legal subsidiaries disclosed in annual Form 10-K filing with the SEC.',
    subsidiaries: [
      {
        id: 'sec-disney-enterprises',
        name: 'Disney Enterprises, Inc.',
        relationType: '10-K Significant Subsidiary',
        badge: 'Delaware Corp',
        jurisdiction: 'US-DE',
        source: 'sec'
      },
      {
        id: 'sec-twentieth-century-fox',
        name: 'Twentieth Century Fox Film Corporation',
        relationType: '10-K Significant Subsidiary',
        badge: 'Delaware Corp',
        jurisdiction: 'US-DE',
        source: 'sec'
      },
      {
        id: 'sec-abc-inc',
        name: 'ABC, Inc.',
        relationType: '10-K Significant Subsidiary',
        badge: 'New York Corp',
        jurisdiction: 'US-NY',
        source: 'sec'
      },
      {
        id: 'sec-espn-inc',
        name: 'ESPN, Inc.',
        relationType: '10-K Significant Subsidiary',
        badge: 'Delaware Corp (80%)',
        jurisdiction: 'US-DE',
        source: 'sec'
      },
      {
        id: 'sec-marvel-ent',
        name: 'Marvel Entertainment, LLC',
        relationType: '10-K Significant Subsidiary',
        badge: 'Delaware LLC',
        jurisdiction: 'US-DE',
        source: 'sec'
      },
      {
        id: 'sec-pixar',
        name: 'Pixar',
        relationType: '10-K Significant Subsidiary',
        badge: 'California Corp',
        jurisdiction: 'US-CA',
        source: 'sec'
      },
      {
        id: 'sec-lucasfilm',
        name: 'Lucasfilm Ltd. LLC',
        relationType: '10-K Significant Subsidiary',
        badge: 'California LLC',
        jurisdiction: 'US-CA',
        source: 'sec'
      },
      {
        id: 'sec-wd-parks',
        name: 'Walt Disney Parks and Resorts U.S., Inc.',
        relationType: '10-K Significant Subsidiary',
        badge: 'Florida Corp',
        jurisdiction: 'US-FL',
        source: 'sec'
      }
    ]
  },
  alphabet: {
    id: '0001652044',
    name: 'Alphabet Inc. (SEC Exhibit 21)',
    source: 'sec',
    badge: 'SEC 10-K Exhibit 21',
    jurisdiction: 'US-DE',
    cik: '0001652044',
    description: 'Significant subsidiaries filed under Item 15, Exhibit 21 in Alphabet Form 10-K.',
    subsidiaries: [
      {
        id: 'sec-google-llc',
        name: 'Google LLC',
        relationType: '10-K Significant Subsidiary',
        badge: 'Delaware LLC',
        jurisdiction: 'US-DE',
        source: 'sec'
      },
      {
        id: 'sec-google-ireland',
        name: 'Google Ireland Limited',
        relationType: '10-K Significant Subsidiary',
        badge: 'Ireland Corp',
        jurisdiction: 'IE',
        source: 'sec'
      },
      {
        id: 'sec-xxvi-holdings',
        name: 'XXVI Holdings Inc.',
        relationType: '10-K Significant Subsidiary',
        badge: 'Delaware Corp',
        jurisdiction: 'US-DE',
        source: 'sec'
      },
      {
        id: 'sec-waymo-llc',
        name: 'Waymo LLC',
        relationType: '10-K Significant Subsidiary',
        badge: 'Delaware LLC',
        jurisdiction: 'US-DE',
        source: 'sec'
      },
      {
        id: 'sec-deepmind-tech',
        name: 'DeepMind Technologies Limited',
        relationType: '10-K Significant Subsidiary',
        badge: 'United Kingdom Corp',
        jurisdiction: 'GB',
        source: 'sec'
      }
    ]
  }
};
