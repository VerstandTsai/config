import { App } from "astal/gtk3"
import style from "./style.scss"
import Bar from "./widget/Bar"
import Wallpaper from "./widget/Wallpaper"
import PowerMenu from "./widget/PowerMenu"

App.start({
  css: style,
  main() {
    App.get_monitors().map(Bar)
    App.get_monitors().map(Wallpaper)
    App.get_monitors().map(PowerMenu)
  },
})
