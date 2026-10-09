import { useEffect, useState } from "react";
import TvSeriesProgressTracker from "./components/tvSeriesProgressTracker/index.jsx";
import BackToTop from "./components/backToTop/index.jsx";
import SiteFooter from "./components/siteFooter/index.jsx";
import SiteHeader from "./components/siteHeader/index.jsx";
import styles from "./App.module.css";

const App = () => {
    const [showBackToTop, setShowBackToTop] = useState(false);
    useEffect(() => {
        const update = () => setShowBackToTop(window.scrollY > 50);
        window.addEventListener("scroll", update, { passive: true });
        update();
        return () => window.removeEventListener("scroll", update);
    }, []);
    const repoUrl = "https://github.com/a2rp/tv-series-progress-tracker";
    return <div className={styles.appShell} id="top">
        <SiteHeader title="Next Episode" mark="N" repoUrl={repoUrl} navItems={[['Your shows','#shows'],['Coming up','#coming-up']]} />
        <main className={styles.pageContent}><TvSeriesProgressTracker /></main>
        <SiteFooter repoUrl={repoUrl} />
        <BackToTop visible={showBackToTop} />
    </div>;
};

export default App;