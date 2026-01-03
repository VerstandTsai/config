import app from "ags/gtk4/app"
import { Astal, Gdk } from "ags/gtk4"

export default function Wallpaper(gdkmonitor: Gdk.Monitor) {
  return (
    <window
      layer={Astal.Layer.BACKGROUND}
      visible
      name="wallpaper"
      class="Wallpaper"
      gdkmonitor={gdkmonitor}
      anchor={Astal.WindowAnchor.NONE}
      application={app}
      exclusivity={Astal.Exclusivity.IGNORE}
    >
      <image file="/home/verstand/.wallpaper" pixelSize={gdkmonitor.geometry.width} />
    </window>
  )
}

