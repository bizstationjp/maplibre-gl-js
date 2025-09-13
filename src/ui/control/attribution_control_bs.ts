import {DOM} from '../../util/dom';

import type {Map} from '../map';
import type {ControlPosition, IControl} from './control';
/**
 * The {@link AttributionControl} options object
 */
export type AttributionControlOptions = {
    /**
     * If `true`, the attribution control will always collapse when moving the map. If `false`,
     * force the expanded attribution control. The default is a responsive attribution that collapses when the user moves the map on maps less than 640 pixels wide.
     * **Attribution should not be collapsed if it can comfortably fit on the map. `compact` should only be used to modify default attribution when map size makes it impossible to fit default attribution and when the automatic compact resizing for default settings are not sufficient.**
     */
    compact?: boolean;
    /**
     * Attributions to show in addition to any other attributions.
     */
    customAttribution?: string | Array<string>;
};

export const defaultAttributionControlOptions: AttributionControlOptions = {
    compact: true,
    customAttribution: '<a href="https://maplibre.org/" target="_blank">MapLibre</a>'
};

/**
 * An `AttributionControl` control presents the map's attribution information. By default, the attribution control is expanded (regardless of map width).
 * @group Markers and Controls
 * @example
 * ```ts
 * let map = new Map({attributionControl: false})
 *     .addControl(new AttributionControl({
 *         compact: true
 *     }));
 * ```
 */
export class AttributionControlBs implements IControl {
    options: AttributionControlOptions;
    _map: Map;
    _container: HTMLElement;
    _innerContainer: HTMLElement;
    _attribHTML: string;

    /**
     * @param options - the attribution options
     */
    constructor(options: AttributionControlOptions = defaultAttributionControlOptions) {
        this.options = options;
    }

    setAttribution(attribution: string) {
        this._attribHTML = attribution;
        this._updateAttributions();
    }

    getDefaultPosition(): ControlPosition {
        return 'bottom-right';
    }

    /** {@inheritDoc IControl.onAdd} */
    onAdd(map: Map) {
        this._map = map;
        this._container = DOM.create('div', 'maplibregl-ctrl maplibregl-ctrl-attrib');
        this._innerContainer = DOM.create('div', 'maplibregl-ctrl-attrib-inner', this._container);

        this._updateAttributions();

        return this._container;
    }

    /** {@inheritDoc IControl.onRemove} */
    onRemove() {
        DOM.remove(this._container);

        this._map = undefined;
        this._attribHTML = undefined;
    }

    _setElementTitle(element: HTMLElement, title: 'ToggleAttribution' | 'MapFeedback') {
        const str = this._map._getUIString(`AttributionControl.${title}`);
        element.title = str;
        element.setAttribute('aria-label', str);
    }

    _updateAttributions() {
        if (this._attribHTML) {
            this._innerContainer.innerHTML = DOM.sanitize(this._attribHTML);
            this._container.classList.remove('maplibregl-attrib-empty');
        } else {
            this._container.classList.add('maplibregl-attrib-empty');
        }
    }
}
