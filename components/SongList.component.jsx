import styles from "../styles/Home.module.css";

import global_controllers, { get_artwork_url } from "../config/controllers";

import {
  BsPlayCircle,
  BsMusicNoteBeamed,
  BsCopy,
  BsBookmarkPlus,
  BsBookmarkHeartFill,
} from "react-icons/bs";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
  useCallback
} from "react";

import { 
  HiMiniPlay, 
  HiChevronRight,
  HiChevronLeft
} from "react-icons/hi2";

import { motion } from "framer-motion";

import Image from "next/legacy/image";

import styled, { css } from "styled-components";

import { is_favorite_song, toggle_favorite_song } from "../config/controllers";

const PaddingElement = styled.tr.attrs(props => ({
  style: {
    width: `100%`,
    height: `${props.paddingHeight}px`,
  },
}))``;

export const bili2_icon = () => {
  return (
    <svg
      width="1em"
      height="1em"
      fill="currentColor"
      viewBox="0 0 24 24"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Bilibili icon</title>
      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.496-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.496 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.496.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373Z" />
    </svg>
  );
};

const netease_icon = () => {
  return (<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <path d="M350.375 62h323.25C774.5 62 812 72.5 846.875 92A204.375 204.375 0 0 1 932 177.125c19.5 34.875 30 72.375 30 173.25v323.25c0 100.125-10.5 136.5-30 173.25A204.375 204.375 0 0 1 846.875 932c-37.5 19.5-73.125 30-173.25 30h-323.25C249.5 962 212 951.5 177.125 932A204.375 204.375 0 0 1 92 846.875C72.5 812 62 774.5 62 673.625v-323.25C62 249.5 72.5 212 92 177.125A204.375 204.375 0 0 1 177.125 92C212 72.5 249.5 62 350.375 62z" fill="#FFFFFF"></path>
    <path d="M645.125 177.875a156.75 156.75 0 0 1 58.875 28.5 43.875 43.875 0 0 1 15 18.375 37.5 37.5 0 0 1-3.375 34.875 37.5 37.5 0 0 1-51.375 11.625c-4.125-2.625-7.125-6.375-11.25-8.625a67.875 67.875 0 0 0-37.5-12.375 37.5 37.5 0 0 0-24 12.375 26.625 26.625 0 0 0-7.125 24l13.875 52.125a201 201 0 0 1 94.5 27.75 269.625 269.625 0 0 1 72.375 64.875 225 225 0 0 1 37.5 75A249.375 249.375 0 0 1 812 593a275.25 275.25 0 0 1-15 72 282 282 0 0 1-112.5 138 300 300 0 0 1-124.125 43.5 310.5 310.5 0 0 1-91.125 0 300 300 0 0 1-164.25-87 322.5 322.5 0 0 1-85.125-297.375 316.5 316.5 0 0 1 189.75-225 50.25 50.25 0 0 1 42 2.25A37.5 37.5 0 0 1 467 274.625a37.5 37.5 0 0 1-24 30.75 241.5 241.5 0 0 0-153.375 193.5 246 246 0 0 0 13.5 119.25 242.25 242.25 0 0 0 112.5 129.75A219.375 219.375 0 0 0 518 772.625a255.75 255.75 0 0 0 85.875-15.375 203.625 203.625 0 0 0 111-95.25 166.5 166.5 0 0 0 14.25-33.75 187.5 187.5 0 0 0 0-104.25 158.25 158.25 0 0 0-47.625-73.125A208.5 208.5 0 0 0 650 428a120.375 120.375 0 0 0-31.5-12c7.5 30 15.75 60 23.625 90.375l3.75 21.75a127.875 127.875 0 0 1-103.125 129.75 122.625 122.625 0 0 1-90-16.875 135.375 135.375 0 0 1-53.25-69 163.875 163.875 0 0 1-9-49.125 169.5 169.5 0 0 1 28.5-103.5 187.5 187.5 0 0 1 104.25-72l-9-34.875a103.5 103.5 0 0 1 5.625-75 108.375 108.375 0 0 1 27-34.125A110.25 110.25 0 0 1 587 178.625a112.5 112.5 0 0 1 58.125-0.75z" fill="#D81E06"></path>
    <path d="M490.25 451.625a87.75 87.75 0 0 0-22.125 42 112.5 112.5 0 0 0 0 43.5 64.875 64.875 0 0 0 24.75 40.5 47.625 47.625 0 0 0 37.5 7.125A52.5 52.5 0 0 0 572.75 536a135 135 0 0 0-3.375-17.25L543.5 420.875a119.625 119.625 0 0 0-53.25 30.75z" fill="#FFFFFF"></path>
  </svg>);
}

const PillList = ({ props: [song_info, song_idx, BVID, EffThis,] }) => {
  const [is_favorite, set_is_favorite] = useState(null);
  useEffect(() => {
    const is_local = is_favorite_song(song_info.song_name);
    set_is_favorite(is_local);
  }, [EffThis, song_info]);

  const [show_love, set_show_love] = useState(false);

  return (
    <div className="flex flex-row items-center">
      <span className="ml-[0.5rem] h-[2rem] w-[2rem] inline-flex items-center
      sm:group-hover/tablename:text-white relative justify-center"
        onClick={(e) => {
          e.stopPropagation();
          toggle_favorite_song(song_info.song_name, is_favorite, () => {
            set_is_favorite(!is_favorite);
            if (!is_favorite) {
              set_show_love(true);
            }
          });
        }}
      >
        {
          is_favorite
            ? <BsBookmarkHeartFill className="text-accent-3 hover:text-accent-3 transition-colors duration-100" />
            : <BsBookmarkPlus className="text-label hover:text-accent-3 transition-colors duration-100" />
        }
        {
          show_love 
          ? <motion.div className="absolute h-[2rem] w-[2rem] bg-black rounded-full overflow-hidden top-0 right-0 left-0 bottom-0"
              initial={{ opacity: 0, scale: 0, transform: 'translateY(0px)' }}
              animate={{ opacity: [0, 1, 1, 1, 0], scale: [0, 1, 1, 1, 1], transform: 'translateY(-15px)' }}
              onAnimationComplete={() => set_show_love(false)}
            >
              <Image src="/assets/images/emoticon_love.webp" alt="artwork"
                width={0} height={0} sizes="100vw" layout="fill" unoptimized
              />
            </motion.div>
          : null
        }
      </span>
      <span className="h-[1.2rem] inline-flex 
        items-center rounded-full 
        px-2 py-1 text-xs font-medium 
        ring-1 ring-inset ring-bilibili
      text-bilibili 
      sm:group-hover/tablename:text-white
      sm:group-hover/tablename:bg-bilibili
      sm:hover:ring-white
        transition-colors duration-100"
        onClick={
          e => void (
            e.stopPropagation(),
            EffThis.show_bili_player({ title: song_info.song_name, bvid: BVID })
          )
        }
      >
        <div className="inline mr-[3px]">
          {bili2_icon()}
        </div> BiliBili
      </span>
      <span className="ml-[0.5rem] h-[1.2rem] inline-flex 
        items-center rounded-full
        px-2 py-1 font-medium 
      text-badge-play ring-1 ring-inset 
      ring-badge-play text-xs
      sm:hover:ring-white
      sm:group-hover/tablename:text-white 
      sm:group-hover/tablename:bg-badge-play
        transition-colors duration-100"
        onClick={(e) => {
          e.stopPropagation();
          EffThis.play_music_at(song_idx)
        }}
      >
        <div className="inline mr-[3px]">
          <BsPlayCircle />
        </div> 播放
      </span>
    </div>
  );
}

const CompactButtonList = ({ props: [songInfo, songIdx, BVID, EffThis,] }) => {
    const [isFavorite, setIsFavorite] = useState(null);
    useEffect(() => {
      const isLocal = is_favorite_song(songInfo.song_name);
      setIsFavorite(isLocal);
    }, [EffThis, songInfo]);

    const hasRecord = get_artwork_url(BVID.trim().split(/，/g)) !== '/favicon.png'; 

    const [showLove, setShowLove] = useState(false);

    return (
      <>
        <div className="shrink-0">
        <div className={`sm:hidden flex flex-row ${hasRecord ? 'inline' : 'hidden'} items-center mr-[-0.5rem]`}>
          <span
            className="text-bilibili text-[1rem]"
            onClick={
              (e) => {
                e.stopPropagation();
                EffThis.show_bili_player({
                  title: songInfo.song_name,
                  bvid: BVID,
                });
              }
            }
          >
            {bili2_icon()}
          </span>
          <span onClick={
            (e) => {
              e.stopPropagation();
              EffThis.play_music_at(songIdx);
            }
          }>
            <HiMiniPlay className="ml-3 text-label text-[1rem]" />
          </span>
          <span className="inline-flex relative items-center justify-center w-[2rem] h-[2rem]"
            onClick={(e) => {
              e.stopPropagation();
              toggle_favorite_song(songInfo.song_name, isFavorite, () => {
                setIsFavorite(!isFavorite);
                if (!isFavorite) {
                  setShowLove(true);
                }
              });
            }}
          >
            {isFavorite ? (
              <BsBookmarkHeartFill className="text-oen-red text-[1rem]" />
            ) : (
              <BsBookmarkPlus className="text-label text-[1rem]" />
            )}
            {
              showLove ?
              <motion.div className="absolute h-[2rem] w-[2rem] bg-black rounded-full overflow-hidden top-0 right-0 left-0 bottom-0"
                initial={{ opacity: 0, scale: 0, transform: 'translateY(0px)' }}
                animate={{ opacity: [0, 1, 1, 1, 0], scale: [0, 1, 1, 1, 1], transform: 'translateY(-15px)' }}
                onAnimationComplete={() => setShowLove(false)}
              >
                <Image src="/assets/images/emoticon_love.webp" alt="artwork"
                  width={0} height={0} sizes="100vw" layout="fill" unoptimized
                />
              </motion.div>
              : null
            }
          </span>
        </div>
        <button className={`ml-[0.5rem] h-[1.2rem] inline-flex 
          items-center rounded-full
          px-2 py-1 font-medium 
        text-secondary-label ring-1 ring-inset 
        ring-secondary-label text-xs shrink-0
          transition-colors duration-100 ${hasRecord ? 'hidden' : 'inline'}
          hover:ring-white hover:text-white hover:bg-secondary-label`}
          onClick={(e) => {
            e.stopPropagation();
            alert("暂时没有歌切记录；；");
          }}
          >
          <div className="inline">
            无记录
          </div>
        </button>
        </div>
      </>
    );
}


export default function SongList
  ({ props: [inputList, EffThis,] }) {
  const song_table_default = () => (
    <table>
      <tbody>
        <tr>
          <td>歌单里没有诶~隐藏歌单碰碰运气!</td>
        </tr>
      </tbody>
    </table>
  )

  const [rowHeight, setRowHeight] = useState(60);
  const [tableOffset, setTableOffset] = useState(0);
  const [paddingBottom, setPaddingBottom] = useState(inputList.length * 80);
  const [paddingTop, setPaddingTop] = useState(0);
  const [visibleStart, setVisibleStart] = useState(0);
  const [visibleLength, setVisibleLength] = useState(100);

  const rowRef = useRef(null);
  const tableRef = useRef(null);

  const visibleData = useMemo(() => {
    return inputList.slice(visibleStart, visibleStart + visibleLength);
  }, [inputList, visibleLength, visibleStart]);

  useEffect(() => {
    if (rowRef.current) {
      setRowHeight(rowRef.current.clientHeight + 12);
    }
    if (tableRef.current) {
      setTableOffset(tableRef.current.offsetTop);
    }
  }, []);

  let scrollCallback = useCallback(() => {
    if (tableRef.current) {
      let offset = window.scrollY - tableRef.current.offsetTop;
      if (offset < 0) {
        offset = 0;
      }
      const startIndex = Math.floor(offset / rowHeight);
      setVisibleStart(startIndex);
      const visibleLength = Math.ceil(window.innerHeight / rowHeight) + 1;
      setVisibleLength(visibleLength);
      setPaddingTop(startIndex * rowHeight);
      setPaddingBottom(
        (inputList.length - startIndex - visibleLength) * rowHeight
      );
    }
  }, [inputList, rowHeight, tableOffset]);

  useEffect(() => {
    scrollCallback();
    window.addEventListener("scroll", scrollCallback);
    return () => {
      window.removeEventListener("scroll", scrollCallback);
    };
  }, [scrollCallback]); 

  const song_table_normal = () => {
    const song_table_row = (songInfo, songIdx) => {
      let out = {};
      if (typeof songInfo.song_translated_name === 'string') {
        const name = songInfo.song_translated_name.trim();
        if (name.length) {
          out.translated_name = (
            <div className="group/translated flex items-center align-middle sm:text-[0.9rem] sm:p-0 sm:hover:cursor-main-cursor text-secondary-label transition-colors duration-100">
              <span className="opacity-[.0] mr-[0.5rem] 
              hidden
              sm:group-hover/translated:opacity-100 
              sm:group-hover/translated:inline
              transition-all duration-100">
                <BsCopy />
              </span>
              <span className="transition-all duration-100">{name}</span>
            </div>
          )
        }
      }

      if (typeof songInfo.date_list === 'string') {
        let date_list = songInfo.date_list.trim().split(/，/g).map(a => Date.parse(a)).filter(a => !isNaN(a));
        if (date_list.length) {
          date_list.sort();
          const last = new Date(date_list[date_list.length - 1]);
          out.last_date = (`${last.getFullYear()}-${last.getMonth() + 1}-${last.getDate()} / ${songInfo.song_count}`)
        }
      }

      out.BVID = '';
      let bvid_list = null;
      if (typeof songInfo.BVID === 'string') {
        const bvid_list_plain = songInfo.BVID.trim();
        if (bvid_list_plain.length) {
          out.BVID = bvid_list_plain;
          out.bili2_icon = <>
            <div className="hidden sm:inline">
              <PillList props={[songInfo, songIdx, out.BVID, EffThis]} />
            </div>
          </>;
        }
        bvid_list = bvid_list_plain.split(/，/g);
      }
      let artwork_url = '/favicon.png';
      if (bvid_list !== null && bvid_list.length > 0) {
        let latest_bvid = bvid_list[bvid_list.length - 1];
        if (latest_bvid.endsWith("，")) {
          latest_bvid = latest_bvid.slice(0, -1);
        }
        if (latest_bvid.length > 0) {
          artwork_url = `/api/v2/video/resource?bvid=${latest_bvid}&pic=1`;
        }
      }

      return (
        <tr
          className={`${styles.song} 
          rounded-lg
          sm:hover:backdrop-blur-3xl 
          sm:hover:backdrop-brightness-125 
          transition-all duration-300`}
          key={songInfo.index}
          ref={rowRef}
        >
          <td>
            <motion.div
              suppressHydrationWarning
              className="flex flex-row items-center justify-between"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0.5, 1, 1, 1, 1], scale: [0.9, 1, 1, 1, 1] }}
            >
              <div
                suppressHydrationWarning
                className="song_table__name w-full
                group/tablename break-all sm:w-[70%]
                text-base sm:hover:cursor-main-cursor"
                onClick={() => {
                  global_controllers.copy_to_clipboard(songInfo.song_name);
                }}
              >
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center h-[4.5rem]">
                    <div className="inline shrink-0 sm:ml-3 sm:w-[3.5rem] sm:h-[3.5rem] w-[3rem] h-[3rem] relative">
                      <Image
                        src={artwork_url}
                        alt="artwork"
                        className="rounded-md shrink-0 text-sm object-cover"
                        unoptimized
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/favicon.png";
                        }}
                        layout="fill"
                        objectFit="cover"
                        width={0}
                        height={0}
                        size="100vw"
                        loader={({ src }) => src}
                      />
                    </div>
                    <div className="flex flex-col w-full">
                      <div
                        className="song-table-song-name 
                          group/songname items-center flex pl-[0.8rem] 
                          grouptext-white sm:pt-[0.5rem]
                          transition-colors duration-100"
                      >
                        <span className="flex flex-wrap items-center justify-between w-[100%]">
                          <span className="inline-flex align-middle items-center">
                            <span
                              className="mr-[0.5rem]
                              inline sm:group-hover/songname:hidden"
                            >
                              <BsMusicNoteBeamed className="text-label text-sm sm:text-base" />
                            </span>
                            <span
                              className="sm:group-hover/songname:underline text-sm 
                              sm:text-base text-label text-nowrap max-w-[50vw] 
                              overflow-hidden text-ellipsis sm:overflow-visible"
                            >
                              {songInfo.song_name.replace(/\s/g, "  ")}
                            </span>
                            <BsCopy
                              className="ml-[0.5rem] opacity-[.0] 
                                  hidden
                                  h-[1rem] text-label
                                  sm:group-hover/songname:opacity-100 
                                  sm:group-hover/songname:inline
                                  transition-opacity duration-100"
                            />
                          </span>
                        </span>
                      </div>
                      <div className="break-all text-sm font-normal pl-[0.8rem] sm:pb-[0.5rem]">
                        <div
                          className="sm:hover:underline text-label font-normal"
                          onClick={(event) => {
                            event.stopPropagation();
                            global_controllers.copy_to_clipboard(
                              songInfo.song_translated_name
                            );
                          }}
                        >
                          {out.translated_name}
                        </div>
                        <span className="text-secondary-label text-xs hidden sm:block">
                          {songInfo.remarks}
                        </span>
                      </div>
                      <div className="flex flex-row flex-nowrap">
                        <div
                          className="block sm:hidden pl-[0.8rem] text-xs text-secondary-label text-nowrap max-w-[30vw]
                          overflow-hidden sm:overflow-visible sm:text-wrap text-ellipsis"
                        >
                          {songInfo.artist}
                        </div>
                        <div
                          className="block sm:hidden pl-[0.3rem] text-xs text-secondary-label text-nowrap max-w-[50vw]
                          overflow-hidden sm:overflow-visible sm:text-wrap text-ellipsis"
                        >
                          {out.last_date}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <CompactButtonList
                      className="sm:hidden"
                      props={[songInfo, songIdx, out.BVID, EffThis]}
                    />
                    {out.bili2_icon}
                  </div>
                </div>
              </div>
              <div className="hidden flex-row items-center sm:flex justify-between sm:w-[30%]">
                <div className="break-all text-sm text-secondary-label pl-[0.8rem] hidden sm:block">
                  {songInfo.artist}
                </div>
                <div className="text-nowrap w-min-[120px] text-secondary-label pl-[0.8rem] text-sm hidden sm:block pr-[1rem]">
                  {out.last_date}
                </div>
              </div>
            </motion.div>
          </td>
        </tr>
      );
    }

    return (
      <table
        className="song_table w-[100%] min-w-fit 
          border-separate
          border-spacing-y-3
          sm:hover:cursor-main-cursor
          [&_tr]:pt-1 
          [&_tr]:pr-0 
          [&_tr]:pb-0
          [&_tr]:pl-2
          [&_tr>td:hover]:bg-opacity-0
          [&_tr>td]:sm:table-cell
          [&_tr>td]:sm:text-left 
          [&_tr>td:hover]:sm:relative 
          [&_tr>td:hover]:sm:overflow-hidden 
          [&_tr>td:hover]:sm:text-label"
        ref={tableRef}
      >
        <tbody className="song_table__tbody overflow-hidden">
          <PaddingElement
            suppressHydrationWarning
            paddingHeight={paddingTop}
          ></PaddingElement>
          {visibleData.map((x) => song_table_row(x, x.idx))}
          <PaddingElement
            suppressHydrationWarning
            paddingHeight={paddingBottom}
          ></PaddingElement>
        </tbody>
      </table>
    );
  }

  return inputList.length > 0 ? song_table_normal() : song_table_default();
}
