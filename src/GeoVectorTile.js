import VectorTile from 'ol/VectorTile';
import TileState from 'ol/TileState';
import LRUCache from 'ol/structs/LRUCache';

class GeoVectorTile extends VectorTile {
    constructor(tileCoord, state, src, format, tileLoadFunction) {
        super(tileCoord, state, src, format, tileLoadFunction);

        this.applyFeatures = new LRUCache(4);
    }

    load() {
        if (this.state == TileState.IDLE) {
            this.setState(TileState.LOADING);
            this.tileLoadFunction_(this, this.url_);
            this.loader_(null, NaN, null);
        }
    }
    disposeInternal() {
        this.features_ = null;
        this.replayGroups_ = {};
        this.applyFeatures.clear()
        this.state = TileState.ABORT;
        this.changed();
        super.disposeInternal();
    }

    getApplyTileInstrictions(zoom) {
        let featuresAndInstructs = undefined;
        if (this.applyFeatures.containsKey(zoom)) {
            featuresAndInstructs = this.applyFeatures.get(zoom);
        }
        return featuresAndInstructs;
    }
    saveApplyTileInstructions(featuresAndInstructs, zoom) {
        this.applyFeatures.set(zoom, featuresAndInstructs);
    }
}

export default GeoVectorTile;