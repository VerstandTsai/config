import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { exec } from "ags/process"
import { createPoll } from "ags/time"
import { createState, createBinding, For } from "ags"
import Hyprland from "gi://AstalHyprland"
import Tray from "gi://AstalTray"
import Wp from "gi://AstalWp"
import Battery from "gi://AstalBattery"

function Start() {
  return (
    <menubutton class="Start">
      󰣇
      <popover>
        <box class="PowerMenu">
          <button class="PowerOff" onClicked={() => exec("poweroff")}>
            <image iconName="system-shutdown-symbolic" pixelSize={64} />
          </button>
          <button class="Reboot" onClicked={() => exec("reboot")}>
            <image iconName="system-reboot-symbolic" pixelSize={64} />
          </button>
          <button class="LogOut" onClicked={() => exec("hyprctl dispatch exit")}>
            <image iconName="system-log-out-symbolic" pixelSize={64} />
          </button>
        </box>
      </popover>
    </menubutton>
  )
}

function Workspaces() {
  const hypr = Hyprland.get_default()
  const workspaces = createBinding(hypr, "workspaces")
  const findById = (id: number) => workspaces((wss) => wss.find((ws) => id === ws.id))
  const focused = createBinding(hypr, "focusedWorkspace")

  return (
    <box class="Workspaces">
      {Array.from({length: 10}, (_, i) => i + 1).map((id) =>
        <revealer
          transitionType={Gtk.RevealerTransitionType.CROSSFADE}
          revealChild={findById(id)((ws) => ws != undefined)}
        >
          <button onClicked={() => findById(id).get()!.focus()}>
            <box class={focused((fws) => id === fws.id ? "focused" : "")} />
          </button>
        </revealer>
      )}
    </box>
  )
}

function Date() {
  const date = createPoll("", 1000,
    "date +'%Y 年 %-m 月 %-d 日 %A'")
  return (
    <menubutton class="Date">
      <box>
        <image class="DateIcon" iconName="x-office-calendar-symbolic" />
        <label label={date} />
      </box>
      <popover>
        <Gtk.Calendar />
      </popover>
    </menubutton>
  )
}

function Time() {
  const hour = createPoll("", 1000, "date +'%-I'")((value) => Number(value))
  const clocks = " "
  return (
    <box class="Time">
      <label class="ClockIcon" label={hour((i) => clocks[i])} />
      <label label={createPoll("", 1000, "date +'%p %H:%M'")} />
    </box>
  )
}

function SysTray() {
  const tray = Tray.get_default()
  const popmenu = (item: Tray.TrayItem) => {
    const popover = Gtk.PopoverMenu.new_from_model(item.menuModel)
    popover.insert_action_group("dbusmenu", item.actionGroup)
    return popover
  }

  return (
    <box class="SysTray">
      <For each={createBinding(tray, "items")}>
        {(item: Tray.TrayItem) =>
          <menubutton visible={createBinding(item, "status")((status) => !!status)}>
            {popmenu(item)}
            <image gicon={createBinding(item, "gicon")} />
          </menubutton>
        }
      </For>
    </box>
  )
}

function AudioSlider() {
  const speaker = Wp.get_default()?.audio.defaultSpeaker!

  return (
    <box class="AudioSlider">
      <button onClicked={() => speaker.mute = !speaker.mute}>
        <image iconName={createBinding(speaker, "volumeIcon")} />
      </button>
      <slider
        onChangeValue={({value}) => {speaker.volume = value}}
        value={createBinding(speaker, "volume")}
      />
    </box>
  )
}

function BatteryLevel() {
  const battery = Battery.get_default()
  const percentage = createBinding(battery, "percentage")
  const label = percentage((value) => ` ${Math.floor(value * 100)}%`)
  const [warned, setWarned] = createState(false)
  percentage.subscribe(() => {
    if (percentage.get() <= 0.2) {
      if (!warned.get()) {
        setWarned(true)
        exec(["notify-send", "Low Battery", "Please charge the laptop."])
      }
    } else { setWarned(false) }
  })

  return (
    <box class="Battery">
      <image iconName={createBinding(battery, "batteryIconName")} />
      <label label={label} />
    </box>
  )
}

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  return (
    <window
      visible
      name="bar"
      class="Bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={app}
    >
      <centerbox cssName="centerbox">
        <box $type="start">
          <Start />
          <Workspaces />
        </box>
        <box $type="center">
          <Date />
          <Time />
        </box>
        <box $type="end">
          <SysTray />
          <AudioSlider />
          <BatteryLevel />
        </box>
      </centerbox>
    </window>
  )
}

