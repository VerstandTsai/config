import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import Apps from "gi://AstalApps"

export default function Dock(gdkmonitor: Gdk.Monitor) {
  const apps = new Apps.Apps()
  const pinnedApps = [
    "firefox",
    "thunderbird",
    "discord",
    "kitty",
    "neovim",
    "vlc",
    "obs",
    "steam"
  ].map((name) => apps.fuzzy_query(name)[0])

  return (
    <window
      visible
      name="dock"
      class="Dock"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={Astal.WindowAnchor.BOTTOM}
      application={app}
      $={(self) => self.marginBottom = -96}
    >
      <Gtk.EventControllerMotion
        onEnter={({widget}) => widget.marginBottom = 0}
        onLeave={({widget}) => widget.marginBottom = -96}
      />
      <box>
        {pinnedApps.map((pinned) =>
          <button class="AppButton" onClicked={() => pinned.launch()}>
            <image iconName={pinned.iconName} pixelSize={64}/>
          </button>
        )}
      </box>
    </window>
  )
}

