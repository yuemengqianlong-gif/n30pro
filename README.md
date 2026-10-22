# Netcore N30 Pro 专用 ImmortalWrt 构建

本仓库用于构建 **Netcore N30 Pro (MT7981B + MT7976)** 的 ImmortalWrt 闭源 Wi-Fi 固件，目标为 **PassWall2、中文 LuCI、设备识别与可验证的设备限速**，**不内置 iStore 或 OpenClash**。

## 状态与安全边界

目前是 **构建工程阶段**，不是已验证可以刷机的固件。构建成功不等于通过 N30 Pro 实机验证。尤其要验证设备树、EEPROM、闪存分区、factory/sysupgrade 镜像、LAN 网络模式、mt_wifi 实际工作情况。

- 上游基础：[`padavanonly/immortalwrt-mt798x-6.6`](https://github.com/padavanonly/immortalwrt-mt798x-6.6)，`openwrt-24.10-6.6`。
- 机型补丁：[`liuyi-htu/Netcore-N30-Pro-patch-for-OpenWrt`](https://github.com/liuyi-htu/Netcore-N30-Pro-patch-for-OpenWrt)。
- 参考构建：[`huladabang/openwrt-n30pro`](https://github.com/huladabang/openwrt-n30pro)。
- 代理：[`openwrt-passwall2`](https://github.com/Openwrt-Passwall/openwrt-passwall2) 与 [依赖仓库](https://github.com/Openwrt-Passwall/openwrt-passwall-packages)。

## 自动构建

打开 [Actions](../../actions) → **Build N30 Pro (validation first)** → **Run workflow**。工作流先核验设备补丁与编译配置，再尝试构建。编译失败时查看完整 Actions 日志；成功生成的文件先作为 **Artifacts（待验证）**，不自动标成可刷机正式发行版。

## 网络与 QoS 注意事项

本机先前作为 AP/交换机使用并承担 DHCP。二层桥接、交换芯片卸载或 MTK HNAT/WED 可能绕过普通软件 QoS，安装 QoSmate **不等于**完成了无线/有线终端的实际限速。品牌识别中的 OUI 仅能代表网卡厂商，随机 MAC 可能无法识别。设备管理与限速必须进一步进行驱动适配及实机测试。

## 版本策略

保留与 N30 Pro 闭源无线匹配的内核和构建基础；PassWall2 及其核心取兼容的版本，不强制混装其它内核分支。所有上游 Commit 必须在构建日志中记录。

## 第四次成功构建与后续功能增量

2026-10-22 的 GitHub Actions #4（commit `7616044`）已成功生成 N30 Pro 的 `initramfs-kernel.bin`、`squashfs-factory.bin` 与 `squashfs-sysupgrade.bin`。该基线已实际从产物 Manifest 核验 `kmod-mt_wifi`、`luci-app-passwall2`、`xray-core`、`luci-app-eqos-mtk`、`luci-app-nlbwmon` 存在，未发现 `luci-app-store` 或 `luci-app-openclash`。这些结果仅代表静态构建检查，不代表刷机测试通过。

下一次构建试验性加入 [`luci-app-deviceid`](https://github.com/wyndam/luci-app-deviceid)：利用 DHCP/ARP/无线客户端线索、MAC OUI 尝试显示设备厂商和设备类型。随机 MAC、网卡 ODM 与整机品牌不一致时可能无法准确识别。该插件支持可选联网查询 MAC 厂商，考虑隐私请在使用时审查并按需关闭在线查询。

**限速现状：** 固件已经包含 MTK EQoS LuCI 界面，尚未验证 AP/桥接模式下对设备流量的整形效果。硬件 HNAT/WED 等卸载可能绕开软件路径。未验证前不要声称可以对所有有线和 Wi-Fi 设备限速。

**版本和使用安全：** 当前 OpenWrt/ImmortalWrt 内核和无线驱动版本与源码快照绑定；不要将未经验证的新内核或无线补丁直接混装。新构建仅上传 Actions Artifacts，不自动发布为正式可刷镜像；历史成功文件可在对应运行页下载。
