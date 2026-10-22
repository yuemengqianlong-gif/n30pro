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
