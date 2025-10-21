import React, { memo, useCallback, useEffect, useState, useRef, useSyncExternalStore } from 'react'

import Head from 'next/head'
import Link from 'next/link'
import Image from "next/legacy/image"

import styles from '../styles/Home.module.css'
import 'react-toastify/dist/ReactToastify.css'

import { Col, Container, Form } from 'react-bootstrap'

import Title from '../components/Title.component'
import SongList from '../components/SongList.component'
import BiliPlayerModal from '../components/BiliPlayerModal.component'
import SongListFilter from '../components/SongListFilter.component'
import MusicPlayerView from '../components/MusicPlayerView.component'
import HeaderView from '../components/HeaderView.component'
import FeaturedSongList from '../components/FeaturedSongList.component'

import imageLoader from '../utils/ImageLoader'

import config, { theme } from '../config/constants'
import { filterSong } from '../config/constants'

import { 
  RetroWindow, 
  RetroButton,
  RetroWindowContainer,
} from '../components/retro/RetroWindow.component'
import RetroSongList from '../components/retro/RetroSongList.component'
import clsx from 'clsx'
import { motion } from 'framer-motion'

import { 
  eff_get, 
  eff_set, 
  get_theme, 
  is_favorite_song, 
  set_theme, 
  favorite_date,
  migrate_localstorage,
  upgrade_app
} from '../config/controllers'

import styled, { css } from "styled-components";

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
  BsPalette2
} from 'react-icons/bs'
import {
  HiChevronUp
} from 'react-icons/hi'

import { useTheme } from 'next-themes'

const BackgroundView = () => {
  return (
    <div
      className={`${styles.outerContainer} transition-all duration-300 bg-main-page-background`}
      style={{ cursor: theme.cursor.normal }}
    />
  );
};

function subscribe(callback) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getSnapshot() {
  return (window.localStorage.getItem('theme') || 'shining');
}

function getSuiSnapshot() {
  return (JSON.parse(window.localStorage.getItem('sui')) || 'false');
}

export function useThemeName() {
  return useSyncExternalStore(subscribe, getSnapshot, () => []);
}

export function useSuiStatus() {
  return useSyncExternalStore(subscribe, getSuiSnapshot, () => []);
}

function ActivityImage(props) {
  const INACTIVE_TIMEOUT = 3 * 1000;

  const [isActive, setIsActive] = useState(false);
  const [initActive, setInitActive] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitActive(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleActivity = () => {
      setIsActive(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        setIsActive(false);
      }, INACTIVE_TIMEOUT);
    };

    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
    ];

    events.forEach((ev) => window.addEventListener(ev, handleActivity));

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((ev) => window.removeEventListener(ev, handleActivity));
    };
  }, []);

  const themeName = useThemeName();

  return (
    <div className="absolute right-0 top-0 w-full sm:w-[85%] 3xl:w-[75%] 4xl:w-[70%] 5xl:w-[65%]">
      <Image
        src={props.selectTheme(themeName)}
        className={`header-image-front transition-opacity duration-500 header-image-front ${!isActive ? 'z-[100] opacity-100' : 'opacity-0 pointer-events-none}'}`}
        alt="header"
        unoptimized
        layout="responsive"
        loader={({ src }) => src}
        onLoad={() => {
          setIsActive(false);
        }}
      />
    </div>
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

  const {theme, setTheme} = useTheme();

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

  const [dynamicTheme, setDynamicTheme] = useState(true);
  const videoRef = React.useRef(null);
  useEffect(() => {
    setDynamicTheme(config.theme[theme].dynamic);
    upgrade_app('3.0.1', () => {
      EffThis.set_theme('neon');
      setDynamicTheme(false);
    })
  }, [theme]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => { })
        .catch((e) => {
          setDynamicTheme(false);
          return e;
        });
    }
  }, [theme]);
  
  const themeName = useThemeName();
  const title = `${config.Name}的歌单`;
  const liverName = config.Name;
  
  const [variant, setVariant] = useState('neon'); // 'neon' | 'classic'
  const [liveWindowsCount, setLiveWindowsCount] = useState(6);
  const [closeMe, setCloseMe] = useState(false);

  let randomGeneratedWindows = [];
  const tellme = [
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
  ]

  for (let i = 0; i < 0x100; ++i) {
    const randomTitle = tellme[Math.floor(Math.random() * tellme.length)];
    const randomContent = tellme[Math.floor(Math.random() * tellme.length)];
    randomGeneratedWindows.push({
      title: randomTitle,
      content: randomContent,
    });
  }

  useEffect(() => {
    console.log('liveWindowsCount: ', liveWindowsCount);
    if (liveWindowsCount > 0) return;
    console.log('Generating random windows...');
  });

  const suiStatus = useSuiStatus();
    
  if (themeName == 'neon') {
    return (
      <div data-theme={theme}>
        <Head>
          <title>{title}</title>
          <meta
            name="keywords"
            content={`B站,bilibili,哔哩哔哩,vtuber,虚拟主播,电台唱见,歌单,${config.Name}`}
          />
          <meta name="description" content={`${config.Name}的歌单`} />
          <link rel="icon" type="image/x-icon" href="/favicon.png"></link>
        </Head>
          <div className="fixed inset-0">
            <div className={suiStatus === true ? "absolute left-[30%] top-0 w-full" : "absolute left-[20%] top-0 w-full"}>
              <Image
                src={suiStatus === true ? sui_wodemaya : sui}
                alt='sui'
                loader={({ src }) => src}
                className="absolute w-full h-full object-cover"
              />
            </div>
          </div>
        <section className={"main-section absolute"}>
          <RetroWindowContainer>
          {liveWindowsCount > 0 && (
            <>
            <RetroWindow
              title={"SUI_1.png"}
              className="relative top-[36rem] left-[25rem] w-[50rem]"
              onClose={() => setLiveWindowsCount(c => c - 1)}
            >
              <div className="">
                <Image
                  src={sui_new}
                  alt="sui_new"
                  width={0} height={0} 
                  loader={({ src }) => src}
                  sizes='100vw' layout='responsive'
                  objectFit='cover' unoptimized
                />
              </div>
            </RetroWindow>
            <RetroWindow
              title={"SUI_MIXUP.png"}
              className="relative top-[10rem] left-[-10rem] w-[50rem]"
              onClose={() => setLiveWindowsCount(c => c - 1)}
            >
              <div className="">
                <Image
                  src={sui_mixup}
                  alt="sui_new"
                  width={0} height={0}
                  loader={({ src }) => src}
                  sizes='100vw' layout='responsive'
                  objectFit='cover' unoptimized
                />
              </div>
            </RetroWindow>
            <RetroWindow
              title={"SUI_SHINING.png"}
              className="relative top-[-65rem] left-[5rem] w-[30rem]"
              onClose={() => setLiveWindowsCount(c => c - 1)}
            >
              <div className="">
                <Image
                  src={headerImageShining}
                  alt="sui_shining"
                  width={0} height={0}
                  loader={({ src }) => src}
                  sizes='100vw' layout='responsive'
                  objectFit='cover' unoptimized
                />
              </div>
            </RetroWindow>
            <RetroWindow
              title={"MUSIC.exe"}
              className="relative top-[-50rem]"
              onClose={() => setLiveWindowsCount(c => c - 1)}
            >
              <RetroSongList 
                songList={song_list}
              />
            </RetroWindow>
            <RetroWindow
              variant={variant}
              title={"README.md"}
              className="relative w-[30rem] top-[-130rem]"
              onClose={() => setLiveWindowsCount(c => c - 1)}
            >
              <div className="space-y-2 text-[1.3rem]">
                <p className="text-title">{liverName}</p>
                <p>
                  已收录的歌曲 {song_list.length} 首
                </p>
                <p>Livestream&nbsp;#25788785</p>
              </div>
            </RetroWindow>
            <RetroWindow
              title={"SUI_JULY_2025.png"}
              className="relative top-[-160rem] left-[-5rem] w-[20rem]"
              onClose={() => setLiveWindowsCount(c => c - 1)}
            >
              <div className="">
                <Image
                  src={sui_neon}
                  alt="sui_neon"
                  width={0} height={0}
                  loader={({ src }) => src}
                  sizes='100vw' layout='responsive'
                  objectFit='cover' unoptimized
                />
              </div>
            </RetroWindow>
            </>
            )}
          </RetroWindowContainer>
          <>
            {
              liveWindowsCount == 0 && (
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
              )
            }
          </>
        </section>
        {
          closeMe && (
            randomGeneratedWindows.map((window, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="absolute"
                style={{ top: `${Math.random() * 100}vh`, left: `${Math.random() * 100}vw`, position: 'absolute' }}
                key={index}
              >
                <RetroWindow
                  key={index}
                  title={window.title}
                  className="w-[30rem] absolute"
                  onClose={() => setLiveWindowsCount(c => c - 1)}
                >
                  <div className="p-4">
                    {
                      Math.random() < 0.5 ? (
                        <p className="text-neonAccent">{window.content}</p>
                      ) : (
                        <p>{window.content}</p>
                      )
                    }
                  </div>
                </RetroWindow>
              </motion.div>
            ))
          )
        }
      </div>
    );
  }
  
  return (
    <div data-theme={theme}>
      <BackgroundView />
      <Head>
        <title>{title}</title>
        <meta
          name="keywords"
          content={`B站,bilibili,哔哩哔哩,vtuber,虚拟主播,电台唱见,歌单,${config.Name}`}
        />
        <meta name="description" content={`${config.Name}的歌单`} />
        <link rel="icon" type="image/x-icon" href="/favicon.png"></link>
        <link
          rel="preload"
          href="/assets/images/emoticon_love.webp"
          as="image"
        />
        <link
          rel="preload"
          href="/assets/images/emoticon_stars_in_your_eyes.webp"
          as="image"
        />
        <link
          rel="preload"
          href="/assets/images/emoticon_bgs1314baobaomuamualovelove.webp"
          as="image"
        />
        <link
          rel="preload"
          href="/assets/images/bgs1314baobaomuamualovelove.gif"
          as="image"
          type="image/gif"
        />
        <link
          rel="preload"
          href="/assets/images/question_mark.gif"
          as="image"
          type="image/gif"
        />
        <link
          rel="preload"
          href='/api/v2/avatar'
          as="image"
          type='image/webp'
        />
        <link
          rel="preload"
          href='/assets/images/theme/header_shining_front.png'
          as="image"
          type='image/png'
        />
      </Head>

      <div
        className="z-[100] bg-gradient-to-b 
        from-transparent to-[30rem] w-screen"
      >
        <div className="absolute right-0 top-0 w-full sm:w-[85%] 3xl:w-[75%] 4xl:w-[70%] 5xl:w-[65%]">
          { !dynamicTheme ?
            <Image
              src={(() => {
                switch (theme) {
                  case 'dark': return headerImageDark;
                  case 'light': return headerImage;
                  case 'flower': return headerImageFlower;
                  case 'marvelous': return headerImageMarvelous;
                  case 'brisk': return headerImageBrisk;
                  case 'idol': return headerImageIdol;
                  case 'lazy': return headerImageLazy;
                  case 'shining': return headerImageShining;
                  default: return headerImage;
                }
              })()}
              className="header-image"
              alt="header"
              unoptimized
              layout="responsive"
              loader={({ src }) => src}
            />
            : <video
                autoPlay
                ref={videoRef}
                loop
                muted
                playsInline
                disablePictureInPicture={true}
                className="header-image relative right-0 top-0"
                width="100%"
              >
                {(
                  () => {
                    switch (themeName) {
                      case 'brisk':
                        return (
                          <>
                            <source src="/api/v2/theme/dynamic?theme=brisk.mp4" type="video/mp4" />
                            <source src="/api/v2/theme/dynamic?theme=brisk.webm" type="video/webm" />
                          </>
                        )
                      case 'idol':
                        return (
                          <>
                            <source src="/api/v2/theme/dynamic?theme=idol.mp4" type="video/mp4" />
                            <source src="/api/v2/theme/dynamic?theme=idol.webm" type="video/webm" />
                          </>
                        )
                  
                    }    
                  }
                )()}
              </video>
          }
        </div>
        {
          themeName === 'shining' &&
          <ActivityImage selectTheme={(themeName) => {
            switch (themeName) {
              case 'shining':
                return headerImageShiningFront;
              default:
                return headerImageShining;
            }
          }}/>
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
    <>
      <SongListWrapper props = {[ filteredSongList, EffThis ]}/>
    </>
  )
}, (prev, next) => {
  if (Object.is(prev, next)) return true;
  
  const prev_keys = Object.keys(prev);
  const next_keys = Object.keys(next);
  
  if (prev_keys.length !== next_keys.length) return false;

  const skips = { props: 1 };

  // props
  if (Array.isArray(prev.props) && Array.isArray(next.props)) {
    if (prev.props.length !== next.props.length) return false;
    for (const [idx, prop] of Object.entries(prev.props)) {
      if (!Object.is(prop, prev.props[idx])) {
        console.log('not equal when iterating!!!');
      }
      if (!Object.is(prop, next.props[idx])) return false;
    }
  }

  let flags = {};

  for (const key of prev_keys) {
    if (skips[key]) continue;
    if (!Object.is(prev[key], next[key])) return false;
    flags[key] = 1;
  }

  for(const key of next_keys) {
    if (skips[key] || flags[key]) continue;
    if (!Object.is(next[key], prev[key])) return false;
  }

  console.log('result: equal');
  return true;
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
    //检测窗口滚动
    window.addEventListener("scroll", () => {
      if (window.scrollY > 600) {
        set_to_top_btn_visibility(true);
      } else {
        set_to_top_btn_visibility(false);
      }
    });
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
