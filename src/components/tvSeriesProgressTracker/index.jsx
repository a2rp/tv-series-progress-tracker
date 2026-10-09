import { useEffect, useMemo, useState } from "react";
import { FiCheck, FiChevronRight, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import ConfirmDialog from "../confirmDialog/index.jsx";
import styles from "./styles.module.css";

const starterShows = [
    { id: 1, title: "The Bear", creator: "FX · Comedy drama", season: 3, watched: 4, episodes: 10, next: "Doors", art: "theBear" },
    { id: 2, title: "Severance", creator: "Apple TV+ · Sci-fi", season: 2, watched: 0, episodes: 10, next: "Hello, Ms. Cobel", art: "severance" },
    { id: 3, title: "Reservation Dogs", creator: "FX · Comedy", season: 2, watched: 8, episodes: 10, next: "Offerings", art: "reservation" },
    { id: 4, title: "The Good Place", creator: "NBC · Comedy", season: 1, watched: 13, episodes: 13, next: "Whenever You're Ready", art: "goodPlace" },
];
const storageKey = "next-episode-shows";

const TvSeriesProgressTracker = () => {
    const [shows, setShows] = useState(() => { try { return JSON.parse(localStorage.getItem(storageKey)) ?? starterShows; } catch { return starterShows; } });
    const [filter, setFilter] = useState("All shows");
    const [search, setSearch] = useState("");
    const [title, setTitle] = useState("");
    const [episodeCount, setEpisodeCount] = useState("8");
    const [removing, setRemoving] = useState(null);
    useEffect(() => localStorage.setItem(storageKey, JSON.stringify(shows)), [shows]);
    const filtered = useMemo(() => shows.filter((show) => {
        const status = show.watched >= show.episodes ? "Finished" : show.watched > 0 ? "In progress" : "Up next";
        return (filter === "All shows" || filter === status) && (show.title + " " + show.creator).toLowerCase().includes(search.toLowerCase());
    }), [shows, filter, search]);
    const advance = (id) => setShows((current) => current.map((show) => show.id === id ? { ...show, watched: Math.min(show.episodes, show.watched + 1) } : show));
    const addShow = (event) => { event.preventDefault(); const clean = title.trim(); if (!clean) return; setShows((current) => [{ id: Date.now(), title: clean, creator: "Added by you", season: 1, watched: 0, episodes: Math.max(1, Number(episodeCount) || 1), next: "Episode 1", art: "newShow" }, ...current]); setTitle(""); };
    const deleteShow = () => { setShows((current) => current.filter((show) => show.id !== removing.id)); setRemoving(null); };
    const watchedTotal = shows.reduce((sum, show) => sum + show.watched, 0);
    const activeCount = shows.filter((show) => show.watched < show.episodes).length;
    const nextShow = shows.find((show) => show.watched > 0 && show.watched < show.episodes) ?? shows.find((show) => show.watched < show.episodes);

    return <div className={styles.tracker}>
        <section className={styles.head} id="shows"><div><p className={styles.label}>A good place to pick up</p><h1>Never lose your place.</h1><p>Track the shows you’re watching and make the next episode easy to find.</p></div><div className={styles.headerNumbers}><span><strong>{activeCount}</strong> active shows</span><span><strong>{watchedTotal}</strong> episodes logged</span></div></section>
        {nextShow && <section className={styles.continueCard} id="coming-up"><div className={styles.continueArt + " " + styles[nextShow.art]} aria-hidden="true"><span>{nextShow.title}</span></div><div className={styles.continueInfo}><span>CONTINUE WATCHING</span><h2>{nextShow.title}</h2><p>Season {nextShow.season} · Episode {nextShow.watched + 1}</p><div className={styles.progress}><span style={{ width: Math.round(nextShow.watched / nextShow.episodes * 100) + "%" }} /></div><small>{nextShow.next}</small></div><button type="button" onClick={() => advance(nextShow.id)} disabled={nextShow.watched >= nextShow.episodes}><FiCheck /> Mark watched</button></section>}
        <section className={styles.showShelf}><div className={styles.shelfHead}><div><h2>Your shows</h2><p>Update your place as you watch.</p></div><label className={styles.search}><FiSearch aria-hidden="true" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search shows" aria-label="Search shows" /></label></div>
            <div className={styles.filterBar} role="group" aria-label="Filter shows">{["All shows", "In progress", "Up next", "Finished"].map((item) => <button key={item} type="button" onClick={() => setFilter(item)} aria-pressed={filter === item} className={filter === item ? styles.selectedFilter : ""}>{item}</button>)}</div>
            <div className={styles.showList}>{filtered.map((show) => {
                const percent = Math.round(show.watched / show.episodes * 100);
                return <article className={styles.showCard} key={show.id}><div className={styles.poster + " " + styles[show.art]} aria-hidden="true"><span>{show.title}</span><small>SEASON {show.season}</small></div><div className={styles.details}><div className={styles.detailHead}><span>{show.creator}</span><button type="button" onClick={() => setRemoving(show)} aria-label={"Remove " + show.title}><FiTrash2 /></button></div><h3>{show.title}</h3><p className={styles.nextEpisode}>{show.watched >= show.episodes ? "Series complete" : "Next up: " + show.next}</p><div className={styles.progress}><span style={{ width: percent + "%" }} /></div><div className={styles.progressMeta}><span>{show.watched} of {show.episodes} episodes</span><span>{percent}%</span></div></div><button className={show.watched >= show.episodes ? styles.doneButton : styles.advanceButton} type="button" onClick={() => advance(show.id)} disabled={show.watched >= show.episodes}>{show.watched >= show.episodes ? <><FiCheck /> Finished</> : <>Watched +1 <FiChevronRight /></>}</button></article>;
            })}</div>
            {!filtered.length && <p className={styles.empty}>No shows in this view. Add a series or change the filter.</p>}
        </section>
        <form className={styles.addShow} onSubmit={addShow}><div><h2>Add a series</h2><p>Start with a show you want to follow.</p></div><label><span>Show title</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Series name" /></label><label><span>Episodes in current season</span><input type="number" min="1" max="100" value={episodeCount} onChange={(event) => setEpisodeCount(event.target.value)} /></label><button type="submit"><FiPlus /> Add series</button></form>
        {removing && <ConfirmDialog title="Remove this series?" description={removing.title + " and its progress will be removed."} confirmLabel="Remove series" onCancel={() => setRemoving(null)} onConfirm={deleteShow} />}
    </div>;
};

export default TvSeriesProgressTracker;
