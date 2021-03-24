
import 'tui-image-editor/dist/tui-image-editor.css'
import ImageEditor from '@toast-ui/react-image-editor'
import React, { Component } from 'react'
import download from 'downloadjs'
import {MapImage} from "../../../../utils/export";
import './style.css'
const icona = require("tui-image-editor/dist/svg/icon-a.svg");
const iconb = require("tui-image-editor/dist/svg/icon-b.svg");
const iconc = require("tui-image-editor/dist/svg/icon-c.svg");
const icond = require("tui-image-editor/dist/svg/icon-d.svg");
const myTheme = {
  "common.backgroundColor": "white",
  "downloadButton.backgroundColor": "white",
  "downloadButton.borderColor": "white",
  "downloadButton.color": "black",
  "menu.normalIcon.path": icond,
  "menu.activeIcon.path": iconb,
  "menu.disabledIcon.path": icona,
  "menu.hoverIcon.path": iconc,
};
export default class MapEditor extends Component {

  state = {
    mapCanvas : null
  }

  editorRef = React.createRef();
  componentDidMount(){
    document.querySelectorAll(".tui-image-editor-header").forEach(e => e.parentNode.removeChild(e))
    this.mapimage = new MapImage()
    this.mapimage.resolution = 150
    this.mapimage.createMapCanvas((canvas)=> {
      this.setState({mapCanvas : canvas})
    })
  }

  componentDidUpdate(){
    document.querySelectorAll(".tui-image-editor-header").forEach(e => e.parentNode.removeChild(e))
  }



  saveImageToDisk = () => {
    const imageEditorInst = this.editorRef.current.getInstance();
    const data = imageEditorInst.toDataURL();
    if (data) {
      const mimeType = data.split(";")[0];
      const extension = data.split(";")[0].split("/")[1];
      download(data, `image.${extension}`, mimeType);
    }
  };
  render() {
    return (
      this.state.mapCanvas &&
      <div onMouseDownCapture={(e) => e.stopPropagation()} className="uiltr" >
  <ImageEditor
    includeUI={{
      loadImage: {
        path: this.state.mapCanvas.toDataURL(),
        name: 'SampleImage'
      },
      menu: ['crop', 'rotate', 'draw', 'shape', 'icon', 'text', 'filter'],
      uiSize: {
        width: '1000px',
        height: '700px'
      },
      theme : myTheme,
      menuBarPosition: 'right',
      locale :  {
        'Text': 'טקסט',
        'DeleteAll': 'מחק הכל',
        'Delete' : 'מחק',
        'Draw' : 'צייר',
        'Shape' : 'צורות',
        'Icon' : 'אייקונים'
    }
    
    }
    }
    selectionStyle={{
      cornerSize: 20,
      rotatingPointOffset: 70
    }}
    usageStatistics={true}
  />
       </div>
    )
  }
}
