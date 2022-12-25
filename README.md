![vultr-monitor](https://github.com/manouriz/vultr-monitor/blob/main/icons/icon1.png) # vultr-monitor Firefox Extension
**vultr-monitor** is a Firefox extension which allows you to monitor resource usage of all servers in a single graph. vultr.com is a cloude service provider. In the website of this company if you have many servers, monitoring the resource of all servers is not simply availavle. You need to open each virtual server page and then go to usage-graph tab and see the resource usage of that server. By installing vultr-monitor Firefox extension, by visiting the products page, you see additionally some graphs which allows you to monitor and compare all servers usage in different categories such as:
- Bandwidth usage (last 30 days)
- CPU usage (Percent)
- Disk Write (Bytes)
- Network Input (Bytes received)

# How to install
- Manually install
  - Download this repository([vultr-monitor.zip](https://github.com/manouriz/vultr-monitor/archive/refs/heads/main.zip)) and extract zip file into a folder on your computer
  - Open Firefox and copy blow text into address bar and press enter key to open **Temporary Extensions** page:
    ```
    about:debugging
    ```
  - Click on **this-firefox** tab on the left menu
  - Click on 'Load Temporary Add-on...' and select manifest.json file 
    ![Temporary Add-on in Firefox](https://github.com/manouriz/vultr-monitor/raw/main/Screenshot-firefox.png)

- Install from Firefox Extesion/Add-ons
  - I just tried to publish this on Firefox Extensions. Then you can easily visit addons.mozilla.org and install the extension by one click. But it is still in progress...

# How to use
Just simply open [vultr.com](https://vultr.com/) website and login to your account. You will see extra graphs above the page.

![Bandwidth usage of all servers in a single graph](https://github.com/manouriz/vultr-monitor/raw/main/Screenshot-bdw.png)

![CPU usage of all servers in a single graph](https://github.com/manouriz/vultr-monitor/raw/main/Screenshot-cpu.png)
