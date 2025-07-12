import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { createBinding, For } from "ags"
import Apps from "gi://AstalApps"

export default function Launcher(gdkmonitor: Gdk.Monitor) {
  const apps = new Apps.Apps()
  const searchEntry = new Gtk.Entry({placeholderText: "Search for apps..."})
  searchEntry.hexpand = true
  const results = createBinding(searchEntry, "text")(
    (prompt) => apps.fuzzy_query(prompt).sort((a, b) => b.frequency - a.frequency)
  )
  let thisWindow: Gtk.Window;

  return (
    <window
      visible
      name="launcher"
      class="Launcher"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={Astal.WindowAnchor.NONE}
      keymode={Astal.Keymode.ON_DEMAND}
      application={app}
      $={(self) => {
        self.hide()
        thisWindow = self
      }}
      onShow={() => searchEntry.grab_focus()}
    >
      <box orientation={Gtk.Orientation.VERTICAL}>
        <box class="SearchBar">
          <image iconName="system-search-symbolic" pixelSize={26} />
          {searchEntry}
        </box>
        <scrolledwindow
          maxContentHeight={512}
          propagateNaturalHeight={true}
          propagateNaturalWidth={true}
          vscrollbarPolicy={Gtk.PolicyType.EXTERNAL}
        >
          <box orientation={Gtk.Orientation.VERTICAL}>
            <For each={results}>
              {(item) =>
                <button onClicked={() => {
                  item.launch()
                  thisWindow.hide()
                }}>
                  <box>
                    <image iconName={item.iconName} pixelSize={48} />
                    <box orientation={Gtk.Orientation.VERTICAL}>
                      <label label={item.name} xalign={0} />
                      <label
                        class="AppDesc"
                        label={item.description}
                        xalign={0}
                      />
                    </box>
                  </box>
                </button>
              }
            </For>
          </box>
        </scrolledwindow>
      </box>
    </window>
  )
}

