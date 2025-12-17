import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import Apps from "gi://AstalApps"

export default function Dock(gdkmonitor: Gdk.Monitor) {
  const apps = new Apps.Apps()
  const pinnedApps = [
    "firefox",
    "thunderbird",
    "discord",
    "spotify",
    "obs",
    "steam",
    "vlc",
    "ghostty",
  ].map((name) => apps.fuzzy_query(name)[0])

  return (
    <window
      visible
      name="dock"
      class="Dock"
      gdkmonitor={gdkmonitor}
      anchor={Astal.WindowAnchor.BOTTOM}
      application={app}
      $={(self) => self.marginBottom = -112}
    >
      <Gtk.EventControllerMotion
        onEnter={({widget}) => widget.marginBottom = 0}
        onLeave={({widget}) => widget.marginBottom = -112}
      />
      <box>
        {pinnedApps.map((pinned) =>
          <button onClicked={() => pinned.launch()}>
            <image iconName={pinned.iconName} pixelSize={64}/>
          </button>
        )}
      </box>
    </window>
  )
}

