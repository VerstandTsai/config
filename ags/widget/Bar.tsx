import app from "ags/gtk4/app"
import { Astal, Gdk } from "ags/gtk4"
import { execAsync } from "ags/process"
import { createPoll } from "ags/time"
import { createBinding, With, For } from "ags"
import Hyprland from "gi://AstalHyprland"
import Tray from "gi://AstalTray"
import Wp from "gi://AstalWp"
import Battery from "gi://AstalBattery"

function Start() {
  return <button
    class="Start"
    onClicked={() => execAsync("wofi")}>
    {"󰣇"}
  </button>
}

function Workspaces() {
  const hypr = Hyprland.get_default()

  return (
    <With value={createBinding(hypr, "workspaces")}>
      {(wss: Hyprland.Workspace[]) =>
        <box class="Workspaces">
          {wss
            .filter(ws => !(ws.id >= -99 && ws.id <= -2))
            .sort((a, b) => a.id - b.id)
            .map(ws => (
              <With value={createBinding(hypr, "focusedWorkspace")}>
                {(focused) =>
                  <button onClicked={() => ws.focus()}>
                    {ws === focused ? "" : ""}
                  </button>
                }
              </With>
            ))
          }
        </box>
      }
    </With>
  )
}

function SysTray() {
  const tray = Tray.get_default()

  return (
    <box class="SysTray">
      <For each={createBinding(tray, "items")}>
        {(item: Tray.TrayItem) =>
          <menubutton
            tooltipMarkup={item.tooltipMarkup}
            menuModel={item.menuModel}
          >
            <image gicon={item.gicon}/>
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

  return (
    <box class="Battery">
      <image iconName={createBinding(battery, "batteryIconName")} />
      <With value={createBinding(battery, "percentage")}>
        {(percentage: number) =>
          <label label={` ${Math.floor(percentage * 100)}%`} />
        }
      </With>
    </box>
  )
}

function Date() {
  const date = createPoll("", 1000,
    "date +'    %Y 年 %-m 月 %-d 日 %A'")
  return <label
    class="Date"
    label={date}
  />
}

function Time() {
  const time = createPoll("", 1000, "date +'󰅐  %p %H:%M'")
  return <label
    class="Time"
    label={time}
  />
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

