import { filterSong } from "../../config/constants";
import {
  RetroWindow, 
  RetroButton,
  RetroBox,
} from "../../components/retro/RetroWindow.component";
import {
  RetroSearchBar,
} from "../../components/retro/RetroSearchBar.component";
import clsx from "clsx";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
import { canonicalizeSong } from "../../config/controllers";
import { useClickAway } from "react-use";
import { TfiAngleDown } from "react-icons/tfi";
import Image from "next/legacy/image";

function RetroDropdown({
  label = "Select",
  defaultValue = "",
  options = {},
  onChange = () => {},
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const dropdownRef = useRef(null);
  useClickAway(ref, (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  });

    return (
      <div className="relative inline-block text-left shrink-0">
        <div
          className={`relative inline-flex justify-center items-center gap-x-1.5
            bg-tertiary-background text-neon-text-1 transition-all duration-100
         `}
          ref={ref}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <TfiAngleDown />
          <div className="relative flex items-center">
            <button
              type="button"
              className="inline-flex items-center"
              id="menu-button"
              aria-expanded="true"
              aria-haspopup="true"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
            >
              {label}
            </button>
          </div>
        </div>
        {isOpen ? (
          <div
            className="origin-top-right !absolute left-0 mt-2 w-32 z-10 
            shadow-lg focus:outline-none 
            h-[10rem] overflow-y-auto border-solid border-3 border-neon-background-2 bg-neon-background-text"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex="-1"
            ref={dropdownRef}
          >
            {Object.keys(options).map((option) => (
              <button
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="block px-3 py-2 text-sm text-label"
                role="menuitem"
                tabIndex="-1"
                id="menu-item-3"
                key={option}
              >
                {options[option]}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    );

}

function RetroCheckbox({
  label = "Tickbox",
  defaultValue = false,
  checked, 
  onChange = () => {},
}) {
  const isControlled = checked !== undefined;
  const [isChecked, setIsChecked] = useState(defaultValue);

  useEffect(() => {
    if (!isControlled) setIsChecked(defaultValue);
  }, [defaultValue, isControlled]);

  const value = isControlled ? !!checked : isChecked;

  const toggle = () => {
    const next = !value; 
    if (!isControlled) setIsChecked(next);
    onChange(next); 
  };

  return (
    <div
      className={`inline-flex items-center cursor-pointer select-none
        ${
          value
            ? "text-neon-accent"
            : "text-neon-text-1 hover:text-neon-action-foreground"
        }`}
      onClick={toggle}
      role="checkbox"
      aria-checked={value}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          toggle();
        }
      }}
    >
      <div
        className={`w-5 h-5 mr-2 border-2 inline-flex flex-row items-center justify-center
        ${
          value
            ? "border-neon-accent bg-neon-accent"
            : "border-neon-text-1 bg-transparent"
        }`}
      >
        {value && <span className="w-3 h-3 bg-black"></span>}
      </div>
      <span>{label}</span>
    </div>
  );
}

const RetroLanguageFilterGroup = ({ 
  onChange = () => {} 
}) => {
  const [language, setLanguage] = useState("");

  const makeHandler = (name) => (nextChecked) => {
    const next = nextChecked ? name : "";
    setLanguage(next);
    onChange(next); 
  };
  const languageList = ["华语", "日语", "英语"];
  return (
    <>
      {languageList.map((lang) => (
        <RetroCheckbox
          key={lang}
          label={lang}
          checked={language === lang}
          onChange={makeHandler(lang)}
        />
      ))}
    </>
  );
};


export default function RetroSongList({
  songList = [],
  rowHeight = 72,
  songListHeight = 0.8
}) {
  const [inputList, setInputList] = useState(songList);
  const [pageIndex, setPageIndex] = useState(1);
  const [perPage, setPerPage] = useState(1);

  const [filterState, setFilterState] = useState({
    lang: "",
    initial: "",
    paid: false,
    remark: "",
    sorting_method: "default",
    is_local: false,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const recompute = () => {
    const vh = window.innerHeight;
    const capacity = Math.floor((vh * songListHeight) / (rowHeight + 5)) || 1;
    setPerPage(capacity);

    const newTotalPage = Math.ceil(inputList.length / capacity);
    if (pageIndex >= newTotalPage) {
      setPageIndex(newTotalPage);
    }
  }

  useEffect(() => {
    window.addEventListener("resize", recompute);
    recompute();
    return () => {
      window.removeEventListener("resize", recompute);
    };
  }, [inputList, rowHeight, songListHeight]);

  const totalPages = Math.ceil(inputList.length / perPage);
  const pageItems = inputList.slice(
    (pageIndex - 1) * perPage,
    pageIndex * perPage
  );

  const generateRow = (song, i) => {
    let renderedSong = canonicalizeSong(song, i);
    return (
      <div className="flex border-b border-gray-600 items-center justify-between"
        key={i}
      >
        <div
          className="py-2 px-3
          flex items-center gap-1"
          style={{ height: `${rowHeight}px` }}
        >
          <div
            className="inline shrink-0
            sm:w-[3.5rem] sm:h-[3.5rem] 
            w-[3rem] h-[3rem] relative mr-1"
          >
          <Image
            src={renderedSong.artwork_url || "/favicon.png"}
            alt={renderedSong.song_name}
            className="object-cover w-full h-full"
            width={56}
            height={56}
            unoptimized
            onError={(e) => {
              e.target.src = "/favicon.png";
            }}
          />
          </div>
          <div className="
            flex flex-col"
            >
            <p className="text-white">{renderedSong.song_name}</p>
            {renderedSong.song_translated_name.length > 0 && (
                <p className="text-neon-text-1 text-sm">
                {renderedSong.song_translated_name}
                </p>
            )}
            {renderedSong.remarks.length > 0 && (
                <p className="text-neon-text-1 text-sm">
                {renderedSong.remarks}
                </p>
            )}
          </div>
        </div>
        <div>
          <div className="inline-flex flex-col pr-3 items-end w-[15vw]">
            {
              renderedSong.artist &&
              renderedSong.artist.length > 0 &&
              <p className="text-neon-text-1 text-sm overflow-ellipsis shrink-0">
                {renderedSong.artist}
              </p>
            }
            <p className="text-neon-text-1 text-sm overflow-ellipsis shrink-0">
              {`${renderedSong.last_date} / ${renderedSong.count}`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const refreshList = () => {
      const filteredSongs = filterSong(songList, searchTerm.trim(), filterState);
      setInputList(filteredSongs);
      recompute();
      setPageIndex(1);
  }
  
  useEffect(() => {
    refreshList();
  }, [searchTerm, filterState]); 

  const sortOptions = {
    "default": "默认歌曲排序", 
    "not_recently": "最近没唱过？", 
    "infrequently": "唱得比较少？", 
    "recently": "最近有唱过？",
    "frequently": "唱得比较多？",
  };

  return (
    <div className="flex flex-col" style={{ height: `${100 * (songListHeight + 0.1)}vh` }}>
      <RetroSearchBar
        onUpdate={(searchTerm) => {
          if (!searchTerm || searchTerm.trim() === "") {
            setInputList(songList);
            setPageIndex(1);
            return;
          }
          setSearchTerm(searchTerm.trim());
        }}
      />
      <div className="flex flex-row pl-1 mt-1 space-x-10">
        <RetroLanguageFilterGroup
          onChange={(lang) => {
            setFilterState((prev) => ({
              ...prev,
              lang: lang,
            }));
          }}
        />
        <RetroCheckbox
          label="收藏夹"
          checked={filterState.is_local}
          onChange={(next) => {
            setFilterState((prev) => ({
              ...prev,
              is_local: next,
            }));
          }}
        />
        <RetroDropdown
          label={
            sortOptions[filterState.sorting_method]
          }
          options={sortOptions}
          onChange={(method) => {
            setFilterState((prev) => ({
              ...prev,
              sorting_method: method,
            }));
          }}
        />
      </div>
      <div className="flex-1 overflow-auto">
        {pageItems.map((song, i) => (
            generateRow(song, i)
        ))}
      </div>
      <div className="flex justify-center gap-4 py-2">
        <RetroButton
          onClick={() => setPageIndex(Math.max(1, pageIndex - 1))}
          disabled={pageIndex <= 1}
        >
          <p className="px-3 py-1 border hover:bg-gray-700">◀ Prev</p>
        </RetroButton>
        <span className="px-2">
          {pageIndex} / {totalPages}
        </span>
        <RetroButton
          onClick={() => setPageIndex(Math.min(totalPages, pageIndex + 1))}
          disabled={pageIndex >= totalPages}
        >
          <p className="px-3 py-1 border hover:bg-gray-700">Next ▶</p>
        </RetroButton>
      </div>
    </div>
  );
}
