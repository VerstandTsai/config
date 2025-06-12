import { App, Astal, Gtk, Gdk } from "astal/gtk3"

export default function Wallpaper(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  return <window
    className="Wallpaper"
    gdkmonitor={gdkmonitor}
    exclusivity={Astal.Exclusivity.IGNORE}
    anchor={TOP | LEFT | RIGHT}
    layer={Astal.Layer.BACKGROUND}
    application={App}>
    <box></box>
  </window>
}
