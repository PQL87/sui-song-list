import React, { memo, useEffect, useRef, useState, useSyncExternalStore } from 'react'

import Head from 'next/head'
import Link from 'next/link'
import Image from "next/legacy/image"

import styles from '../styles/Home.module.css'
import 'react-toastify/dist/ReactToastify.css'

import { Container } from 'react-bootstrap'

import SongList from '../components/SongList.component'
import BiliPlayerModal from '../components/BiliPlayerModal.component'
import SongListFilter from '../components/SongListFilter.component'
import MusicPlayerView from '../components/MusicPlayerView.component'
import HeaderView from '../components/HeaderView.component'
import FeaturedSongList from '../components/FeaturedSongList.component'

import imageLoader from '../utils/ImageLoader'

import config, { filterSong, theme } from '../config/constants'

import { 
  RetroWindow, 
  RetroButton,
  RetroWindowContainer,
} from '../components/retro/RetroWindow.component'
import RetroSongList from '../components/retro/RetroSongList.component'
import { motion } from 'framer-motion'

import { 
  eff_get, 
  eff_set, 
  migrate_localstorage,
  upgrade_app
} from '../config/controllers'

import { song_list } from '../config/song_list'

import headerImage from '../public/assets/images/theme/header.webp'
import headerImageDark from '../public/assets/images/theme/header_dark.webp'
import headerImageFlower from '../public/assets/images/theme/header_flower.webp'
import headerImageMarvelous from '../public/assets/images/theme/header_marvelous.webp'
import headerImageBrisk from '../public/assets/images/theme/header_brisk.webp'
import headerImageIdol from '../public/assets/images/theme/header_idol.webp'
import headerImageLazy from '../public/assets/images/theme/header_lazy.webp'
import headerImageShining from '../public/assets/images/theme/header_shining.webp'
import headerImageShiningFront from '../public/assets/images/theme/header_shining_front.png'

import sui from '../public/assets/images/sui.png'
import sui_new from '../public/assets/images/sui_new.webp'
import sui_mixup from '../public/assets/images/sui_mixup.webp'
import sui_neon from '../public/assets/images/sui_neon.webp'
import sui_wodemaya from '../public/assets/images/sui_wodemaya.png'

import {
  HiChevronUp
} from 'react-icons/hi'

import { useTheme } from 'next-themes'

const PRELOAD_LINKS = [
  { href: '/assets/images/emoticon_love.webp', as: 'image' },
  { href: '/assets/images/emoticon_stars_in_your_eyes.webp', as: 'image' },
  { href: '/assets/images/emoticon_bgs1314baobaomuamualovelove.webp', as: 'image' },
  { href: '/assets/images/bgs1314baobaomuamualovelove.gif', as: 'image', type: 'image/gif' },
  { href: '/assets/images/question_mark.gif', as: 'image', type: 'image/gif' },
  { href: '/api/v2/avatar', as: 'image', type: 'image/webp' },
  { href: '/assets/images/theme/header_shining_front.png', as: 'image', type: 'image/png' },
];

const THEME_HEADER_IMAGES = {
  dark: headerImageDark,
  light: headerImage,
  flower: headerImageFlower,
  marvelous: headerImageMarvelous,
  brisk: headerImageBrisk,
  idol: headerImageIdol,
  lazy: headerImageLazy,
  shining: headerImageShining,
};

const DYNAMIC_THEME_SOURCES = {
  brisk: [
    { src: '/api/v2/theme/dynamic?theme=brisk.mp4', type: 'video/mp4' },
    { src: '/api/v2/theme/dynamic?theme=brisk.webm', type: 'video/webm' },
  ],
  idol: [
    { src: '/api/v2/theme/dynamic?theme=idol.mp4', type: 'video/mp4' },
    { src: '/api/v2/theme/dynamic?theme=idol.webm', type: 'video/webm' },
  ],
};

const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
const INACTIVE_TIMEOUT_MS = 3 * 1000;
const RANDOM_WINDOW_COUNT = 0x100;

const TELL_ME_MESSAGES = [
  "你在干什么？",
  "我会看着你",
  "你去别人的直播间了吗？",
  "没说话的都死刑",
  "不准送别人五朵小花花",
  "降低你的权重",
  "不准和别人说晚安",
  "总感觉你今天好像变冷淡了",
  "你要一直喜欢我好吗",
  "快说啊",
  "一天只能跟除我以外的一个人，说一句话",
  "你不准看别的虚拟主播",
  "你不是跟我签订了契约了吗？",
  "悄悄离开的你在干什么？",
  "我刚刚在窗外趴了好久，怎么这么喜欢乱动呢？",
  "不要这么随便就哭啊",
  "你上次断的肋骨应该还没好完吧",
  "想跑啊想离开我吧",
  "你要干嘛去啊，说啊讲啊",
  "你知不知道啊？",
  "你要乖乖待在我的身边",
  "你要听话",
  "不会说话是吧？",
  "哭什么",
  "你为什么不听我的",
  "今天有减少对我的喜欢吗",
  "你跟别人说晚安只能说晚安句号",
  "别人有事找你你只能说嗯点头",
  "出轨到别的地方了吗",
  "我有点小手段可以查出来",
  "你已经对我的生活没有兴趣了",
  "你愿意错过今天的岁己",
  "说不定岁己今天情绪特别低落",
  "我今天很想被安慰，安慰我的人不是你",
  "我的不安",
  "你也不知道我今天干了什么",
  "我今天讲了什么你可能也不知道"
];

const NEON_IMAGE_WINDOWS = [
  { title: "SUI_1.png", className: "relative top-[36rem] left-[25rem] w-[50rem]", src: sui_new, alt: "sui_new" },
  { title: "SUI_MIXUP.png", className: "relative top-[10rem] left-[-10rem] w-[50rem]", src: sui_mixup, alt: "sui_mixup" },
  { title: "SUI_SHINING.png", className: "relative top-[-65rem] left-[5rem] w-[30rem]", src: headerImageShining, alt: "sui_shining" },
  { title: "SUI_JULY_2025.png", className: "relative top-[-160rem] left-[-5rem] w-[20rem]", src: sui_neon, alt: "sui_neon" },
];

const passthroughLoader = ({ src }) => src;
const getHeaderImage = (themeName) => THEME_HEADER_IMAGES[themeName] || headerImage;
const pickRandom = (messages) => messages[Math.floor(Math.random() * messages.length)];
const createRandomWindows = (messages, count) => Array.from({ length: count }, () => ({
  title: pickRandom(messages),
  content: pickRandom(messages),
}));

function renderDynamicSources(themeName) {
  const sources = DYNAMIC_THEME_SOURCES[themeName];
  if (!sources) return null;
  return sources.map((source) => (
    <source key={source.src} src={source.src} type={source.type} />
  ));
}

function PageHead({ title, includePreloads = false }) {
  return (
    <Head>
      <title>{title}</title>
      <meta
        name="keywords"
        content={`B站,bilibili,哔哩哔哩,vtuber,虚拟主播,电台唱见,歌单,${config.Name}`}
      />
      <meta name="description" content={`${config.Name}的歌单`} />
      <link rel="icon" type="image/x-icon" href="/favicon.png" />
      {includePreloads && PRELOAD_LINKS.map((link) => (
        <link
          key={link.href}
          rel="preload"
          href={link.href}
          as={link.as}
          {...(link.type ? { type: link.type } : {})}
        />
      ))}
    </Head>
  );
}

const BackgroundView = () => {
  return (
    <div
      className={`${styles.outerContainer} transition-all duration-300 bg-main-page-background`}
      style={{ cursor: theme.cursor.normal }}
    />
  );
};



export function useSuiStatus() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener('storage', callback);
      return () => window.removeEventListener('storage', callback);
    },
    () => (JSON.parse(window.localStorage.getItem('sui')) || 'false'),
    () => []
  );
}

function ShiningActivityImage() {
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const handleActivity = () => {
      setIsActive(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        setIsActive(false);
      }, INACTIVE_TIMEOUT_MS);
    };

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity);
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity);
      });
    };
  }, []);


  return (
    <div className="absolute right-0 top-0 w-full sm:w-[85%] 3xl:w-[75%] 4xl:w-[70%] 5xl:w-[65%]">
      <Image
        src={headerImageShiningFront}
        className={`header-image-front transition-opacity duration-500 ${!isActive ? 'absolute z-[100] opacity-100' : 'opacity-0 pointer-events-none'}`}
        alt="header"
        unoptimized
        layout="responsive"
        loader={passthroughLoader}
        onLoad={() => {
          setIsActive(false);
        }}
      />
    </div>
  );
}

function NeonImageWindow({ title, className, src, alt, onClose }) {
  return (
    <RetroWindow title={title} className={className} onClose={onClose}>
      <div>
        <Image
          src={src}
          alt={alt}
          width={0}
          height={0}
          loader={passthroughLoader}
          sizes="100vw"
          layout="responsive"
          objectFit="cover"
          unoptimized
        />
      </div>
    </RetroWindow>
  );
}

function NeonBackground({ suiStatus }) {
  return (
    <div className="fixed inset-0">
      <div className={suiStatus === true ? "absolute left-[30%] top-0 w-full" : "absolute left-[20%] top-0 w-full"}>
        <Image
          src={suiStatus === true ? sui_wodemaya : sui}
          alt="sui"
          loader={passthroughLoader}
          className="absolute w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

function HeaderMedia({ theme }) {
  if (!config.theme[theme]?.dynamic) {
    return (
      <Image
        src={getHeaderImage(theme)}
        className="header-image"
        alt="header"
        unoptimized
        layout="responsive"
        loader={passthroughLoader}
      />
    );
  }

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => { })
        .catch((e) => {
          return e;
        });
    }
  }, [theme]);

  return (
    <video
      autoPlay
      ref={videoRef}
      loop
      muted
      playsInline
      disablePictureInPicture={true}
      className="header-image relative right-0 top-0"
      width="100%"
    >
      {renderDynamicSources(theme)}
    </video>
  );
}


export default function Home() {
  // EffThis
  const [ EffThis ] = useState({
    set_current_album: (album) => {
      EffThis.current_album = album;
    }
  });

  // state variables
  const [ bili_player_visibility ] = EffThis.modalPlayerShow     = useState(false);

  const [ bili_player_title      ] = EffThis.modalPlayerSongName = useState('');

                                     EffThis.BVID                = useState('');

  const [ bvid_list              ] = EffThis.bvid_list           = useState([]);

  const [ bvid_selected          ] = EffThis.bvid_selected       = useState('');

  const [ currently_playing ] = EffThis.currently_playing = useState(-1);

  useEffect(() => {
    if (!window.localStorage.getItem('theme')) {
      window.localStorage.setItem('theme', 'shining');
    }
  }, []);

  const {theme, setTheme} = useTheme();

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === 'theme' && event.newValue !== null) {
        setTheme(event.newValue)
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    migrate_localstorage(song_list);
  }, []);

  // EffThis.functions
  useEffect(() => {
    EffThis.show_bili_player = ({title, bvid, url}) => {
      if (bvid) {
        eff_set(EffThis, 'modalPlayerShow', true);
        eff_set(EffThis, 'modalPlayerSongName', title);
        eff_set(EffThis,'BVID', bvid);
        const list = bvid.split(/，/g);
        const selected = list[0];
        if (selected && eff_get(EffThis, 'bvid_selected') !== selected) {
          eff_set(EffThis, 'bvid_selected', selected);
          eff_set(EffThis, 'bvid_list', list);
        }
      } else if (url) {  // netease url
        window.open('https://music.163.com/#/dj?id=' + url)
      }
    };
    EffThis.hide_bili_player = () => eff_set(EffThis, 'modalPlayerShow', false);
    
    EffThis.play_music_at = (idx) => {
      eff_set(EffThis, 'currently_playing', idx);
    }
    EffThis.play_music_for_name = (name) => { 
      console.error("find name: "+name)
      const idx = EffThis.current_album.findIndex(song => song.song_name === name);
      if (idx !== -1) {
        eff_set(EffThis, 'currently_playing', idx);
      }
    }
    EffThis.set_theme = (theme) => {
      setTheme(theme);
    }
    EffThis.current_theme = () => theme;
  }, [ EffThis, theme ]);

  // state variables
  const [filter_state] = EffThis.filter_state = useState({
    lang: "",
    initial: "",
    paid: false,
    remark: "",
    sorting_method: "default",
    is_local: false,
  });

  const [searchBox, setSearchBox] = EffThis.searchBox = useState('');

  // EffThis.functions
  useEffect(() => {
    //语言过滤
    EffThis.do_filter_lang = (lang) => eff_set(EffThis, 'filter_state', {
      ...eff_get(EffThis, 'filter_state'),
      lang: lang,
      initial: "",
      paid: false,
      remark: ""
    });

    //首字母过滤
    EffThis.do_filter_initial = (initial) => eff_set(EffThis, 'filter_state', {
      ...eff_get(EffThis, 'filter_state'),
      lang: "华语",
      initial: initial,
      paid: false,
      remark: "",
    });

    EffThis.do_sort = (method) => eff_set(EffThis, 'filter_state', {
      ...eff_get(EffThis, 'filter_state'),
      sorting_method: method
    });

    EffThis.do_filter_local = (is_local) => eff_set(EffThis, 'filter_state', {
      ...eff_get(EffThis, 'filter_state'),
      is_local: is_local
    });

    EffThis.do_set_search = (search) => eff_set(EffThis, 'searchBox', search);

  }, [EffThis]);

  useEffect(() => {
    upgrade_app('3.0.1', () => {
      EffThis.set_theme('neon');
    })
  }, [theme]);

  const title = `${config.Name}的歌单`;
  const liverName = config.Name;
  
  const [variant] = useState('neon'); // 'neon' | 'classic'
  const [liveWindowsCount, setLiveWindowsCount] = useState(6);
  const [closeMe, setCloseMe] = useState(false);

  const randomGeneratedWindows = createRandomWindows(TELL_ME_MESSAGES, RANDOM_WINDOW_COUNT);
  const closeLiveWindow = () => setLiveWindowsCount((count) => count - 1);
  const backToDefaultTheme = () => {
    localStorage.removeItem('theme');
    location.reload();
  };

  const suiStatus = useSuiStatus();
    
  if (theme === 'neon') {
    return (
      <div data-theme={theme}>
        <PageHead title={title} />
        <NeonBackground suiStatus={suiStatus} />
        <section className="main-section absolute">
          <RetroWindowContainer>
            {liveWindowsCount > 0 && (
              <>
                {NEON_IMAGE_WINDOWS.slice(0, 3).map((window) => (
                  <NeonImageWindow
                    key={window.title}
                    {...window}
                    onClose={closeLiveWindow}
                  />
                ))}
                <RetroWindow
                  title={"MUSIC.exe"}
                  className="relative top-[-50rem]"
                  onClose={closeLiveWindow}
                >
                  <RetroSongList songList={song_list} />
                </RetroWindow>
                <RetroWindow  
                  variant={variant}  
                  title={"README.md"}  
                  className="relative w-[30rem] top-[-130rem]"  
                  onClose={closeLiveWindow}  
                >  
                  <div className="space-y-2 text-[1.3rem]">  
                    <p className="text-title">{liverName}</p>  
                    <p>已收录的歌曲 {song_list.length} 首</p>  
                    <p>Livestream&nbsp;#25788785</p>  
                  </div>  
                  <div className="mt-4">  
                    <RetroButton onClick={backToDefaultTheme}>  
                      <span className="text-neon-text-1">返回正常主题</span>  
                    </RetroButton>  
                  </div>  
                </RetroWindow>
                <NeonImageWindow
                  {...NEON_IMAGE_WINDOWS[3]}
                  onClose={closeLiveWindow}
                />
              </>
            )}
          </RetroWindowContainer>
          {liveWindowsCount === 0 && (
            <RetroWindow
              title={"你在干什么"}
              onClose={() => {
                setCloseMe(true);
                if (typeof window !== 'undefined') {
                  localStorage.setItem('sui', JSON.stringify(true));
                }
              }}
            >
              <div className="p-4">
                <p>饼干岁 你在吗？</p>
              </div>
            </RetroWindow>
          )}
        </section>
        {closeMe && randomGeneratedWindows.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="absolute"
            style={{
              top: `${Math.random() * 100}vh`,
              left: `${Math.random() * 100}vw`,
            }}
          >
            <RetroWindow
              title={item.title}
              className="w-[30rem] absolute"
              onClose={closeLiveWindow}
            >
              <div className="p-4">
                {Math.random() < 0.5 ? (
                  <p className="text-neonAccent">{item.content}</p>
                ) : (
                  <p>{item.content}</p>
                )}
              </div>
            </RetroWindow>
          </motion.div>
        ))}
      </div>
    );
  }
  
  return (
    <div data-theme={theme}>
      <BackgroundView />
      <PageHead title={title} includePreloads />

      <div
        className="z-[100] bg-gradient-to-b 
        from-transparent to-[30rem] w-screen"
      >
        <div className="absolute right-0 top-0 w-full sm:w-[85%] 3xl:w-[75%] 4xl:w-[70%] 5xl:w-[65%]">
          <HeaderMedia
            theme={theme}
          />
        </div>
        {
          theme === 'shining' &&
          <ShiningActivityImage />
        }
        <section className={"main-section"}>
          <HeaderView props={[EffThis]}/>
          <FeaturedSongList effthis={EffThis} datasrc={
            async () => {
              let list = null;
              await fetch("/api/v2/featured")
                .then((res) => res.json())
                .then((data) => {
                  list = data;
                });
              return list;
            }
          } title="听啥呢饼" />
          <FeaturedSongList effthis={EffThis} datasrc={
              async (list) => {
                list.sort((a, b) => {
                  const a_date = a.date_list
                    .split(/，/g)
                    .map((a) => Date.parse(a))
                    .filter((a) => !isNaN(a))
                    .sort();
                  const b_date = b.date_list
                    .split(/，/g)
                    .map((a) => Date.parse(a))
                    .filter((a) => !isNaN(a))
                    .sort();
                  return b_date[b_date.length - 1] - a_date[a_date.length - 1];
                });
                return list;
            }
          } title="最近更新"/>
          <SongListFilter props={[filter_state, searchBox, EffThis]} />
          <FilteredList props={[filter_state, searchBox, EffThis]} />
          <MusicPlayerView props={[currently_playing, EffThis]} />
        </section>

        <FixedTool />

        <Link href={config.Repository} passHref>
          <footer className={styles.footer}>
            <Image
              loader={imageLoader}
              alt=""
              width={32}
              height={32}
              src="assets/images/github.png"
            />
            {/* <a>{ config.Footer }</a> */}
          </footer>
        </Link>
        <BiliPlayerModal
          props={[
            bili_player_title,
            bili_player_visibility,
            bvid_list,
            bvid_selected,
            EffThis,
          ]}
        />
      </div>
    </div>
  );
}

/** 过滤器控件 */
const FilteredList = memo(function FilteredList({ props: [ filter_state, searchBox, EffThis ] }) {
 
  //过滤歌单列表
  const filteredSongList = filterSong(song_list, searchBox, filter_state);

  EffThis.set_current_album(filteredSongList);

  return (
    <SongListWrapper props = {[ filteredSongList, EffThis ]}/>
  );
}, (prev, next) => {
  if (Object.is(prev, next)) return true;
  if (!Array.isArray(prev.props) || !Array.isArray(next.props)) return false;
  if (prev.props.length !== next.props.length) return false;

  return prev.props.every((value, index) => Object.is(value, next.props[index]));
});

/** 歌单表格 */
function SongListWrapper ({ props: [ List, EffThis ] }) {
  return (
    <Container fluid style = {{ minWidth: 'min-content' }}>
      <SongList props = {[ List, EffThis ]}/>
   </Container>
  );
}

function FixedTool() {
  const [to_top_btn_is_visible, set_to_top_btn_visibility] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        set_to_top_btn_visibility(true);
      } else {
        set_to_top_btn_visibility(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  
  if (!to_top_btn_is_visible) return (<div></div>);
  
  return (
    <div className='flex flex-col items-start right-[1rem]
      bottom-[5rem] fixed space-y-1 sm:right-[calc(1rem+(100vw-(min(100vw,1100px)))/2)]'>
      <button
        className={`
        flex items-center rounded-full shrink-0 
        px-[0.7em] py-[0.1em] space-x-1
        sm:hover:scale-110 transition-all duration-300 
        backdrop-blur-xl bg-accent/10 text-sm
        h-[2rem]`}
        onClick={scrollToTop}
        title='返回顶部'
      >
        <HiChevronUp className="text-base inline text-accent-fg" />
        <span className="text-sm text-accent-fg">返回顶部</span>
      </button>
    </div>
  )
}
