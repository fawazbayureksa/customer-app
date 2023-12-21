import React from "react";
import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";
import WebView from "react-native-webview";
import IframeRenderer, { iframeModel } from "@native-html/iframe-plugin";
import AutoHeightImage from 'react-native-auto-height-image';

const WebDisplay = ({ html, anchorColor }) => {

    // ['auto', '100%'].includes(convertCSS(component.value.width))
    // ? width
    // : convertCSS(component.value.width)

    const { width: contentWidth } = useWindowDimensions();
    const tagsStyles = useMemo(
        () => ({
            img: {
                maxHeight:
                    typeof contentWidth == 'number' ? parseInt(contentWidth) * 0.4 : contentWidth,
                maxWidth: contentWidth * 0.8,
            }
        }),
        [],
    );

    const renderers = useMemo(
        () => ({
            iframe: IframeRenderer
        }),
        [],
    );

    const customHTMLElementModels = useMemo(
        () => ({
            iframe: iframeModel
        }),
        [],
    )

    return (
        <RenderHTML
            contentWidth={contentWidth * 0.85}
            source={{ html: html }}
            tagsStyles={tagsStyles}
            WebView={WebView}
            renderers={renderers}
            customHTMLElementModels={customHTMLElementModels}
        />
    );
}

export default WebDisplay;
