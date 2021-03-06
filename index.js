import * as PropTypes from "prop-types";
import * as React from "react";
import {
  Platform,
  processColor,
  requireNativeComponent,
  View
} from "react-native";
const resolveAssetSource = require("react-native/Libraries/Image/resolveAssetSource");
class MerryPhotoView extends React.Component {
  constructor() {
    super(...arguments);
    /**
     * Handle UIColor conversions
     * @param data Photo[]
     */
    this.photoView = null;
    this.processor = data => {
      if (data && data.length) {
        return data.map(o => {
          const d = { ...o };
          if (typeof o.summaryColor === "string") {
            d.summaryColor = processColor(o.summaryColor);
          }
          if (typeof o.titleColor === "string") {
            d.titleColor = processColor(o.titleColor);
          }
          // resolve assets
          d.source = resolveAssetSource(o.source);
          return d;
        });
      }
      return data;
    };
    this.onChange = event => {
      const { onChange } = this.props;
      if (onChange) {
        const { target, ...rest } = event.nativeEvent;
        onChange(rest);
      }
    };
    this.onComment = event => {
      const { onComment } = this.props;
      if (onComment) {
        const { target, ...rest } = event.nativeEvent;
        onComment(rest);
      }
    };
    this.onActionMore = event => {
      const { onActionMore } = this.props;
      if (onActionMore) {
        const { target, ...rest } = event.nativeEvent;
        onActionMore(rest);
      }
    };
  }
  render() {
    // nothing
    if (this.props.visible === false) {
      return null;
    }
    console.log(this.photoView);
    const { visible, data, initial, ...props } = this.props;
    const dataCopy = [...data];
    const transformData = this.processor(dataCopy);
    // initial
    let startPosition = initial;
    if (initial < 0) {
      startPosition = 0;
    }
    if (initial > dataCopy.length) {
      startPosition = dataCopy.length;
    }
    return (
      <RNMerryPhotoView
        ref={r => (this.photoView = r)}
        {...props}
        onActionMore={this.onActionMore}
        onComment={this.onComment}
        initial={startPosition}
        data={transformData}
        onChange={this.onChange}
      />
    );
  }
}
MerryPhotoView.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      source:
        Platform.OS === "ios"
          ? PropTypes.string
          : PropTypes.oneOfType([
              PropTypes.shape({
                uri: PropTypes.string,
                headers: PropTypes.objectOf(PropTypes.string)
              }),
              // Opaque type returned by require('./image.jpg')
              PropTypes.number,
              // Multiple sources
              PropTypes.arrayOf(
                PropTypes.shape({
                  uri: PropTypes.string,
                  width: PropTypes.number,
                  height: PropTypes.number
                })
              )
            ]),
      title: PropTypes.string,
      summary: PropTypes.string,
      comment: PropTypes.string,
      titleColor: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      summaryColor: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ).isRequired,
  visible: PropTypes.bool,
  initial: PropTypes.number.isRequired,
  hideStatusBar: PropTypes.bool,
  hideCloseButton: PropTypes.bool,
  hideShareButton: PropTypes.bool,
  onDismiss: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  onComment: PropTypes.func,
  onActionMore: PropTypes.func,
  shareText: PropTypes.string,
  ...View.propTypes
};
MerryPhotoView.defaultProps = {
  visible: false
};
var RNMerryPhotoView = requireNativeComponent(
  "MerryPhotoView",
  MerryPhotoView,
  {
    nativeOnly: {
      onChange: true
    }
  }
);
export default MerryPhotoView;
