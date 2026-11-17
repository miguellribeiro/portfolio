import { BirdArtwork, CapybaraArtwork, MonkeyArtwork, VegetationArtwork } from './Artwork';
import './assets/manpe-tokens.css';
import './forest.css';

/** Static-first integration. Actor travel wrappers are separate from layout and pose.
 * The active-time orchestrator (#6) must scope all part queries to its actor ref.
 */
export function Forest({ theme }: { theme: 'dark' | 'light' }) {
  return <div className="manpe-scope manpe-forest" data-manpe-theme={theme}>
    <div className="manpe-scene" data-motion="static" aria-hidden="true">
      <svg viewBox="0 0 960 240" preserveAspectRatio="xMidYMax meet" focusable="false" aria-hidden="true" fill="none">
        <g data-actor="vegetation"><VegetationArtwork /></g>
        {/* Feet y=142 settle on the sloped ground; lowered muzzle reaches grass-a. */}
        <g className="manpe-capybara-anchor" transform="translate(96 115) scale(.67)"><g data-actor="capybara"><CapybaraArtwork /></g></g>
        {/* 506.12 + 118*.66 = 584; 56.12 + 18*.66 = 68. */}
        <g className="manpe-monkey-anchor" transform="translate(506.12 56.12) scale(.66)"><g data-actor="monkey"><MonkeyArtwork /></g></g>
        {/* Local feet (96,106) meet the branch at (900,85). */}
        <g className="manpe-bird-anchor" transform="translate(852 32) scale(.5)"><g data-actor="bird"><BirdArtwork /></g></g>
      </svg>
    </div>
  </div>;
}
