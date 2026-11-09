const fs = require('fs');
const quiz1 = JSON.parse(fs.readFileSync('scratch_quiz1.json', 'utf8'));

// Detailed mappings for all 58 questions
const customDetails = [
  // Q1
  {
    simulatedOutput: `No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 22.04.3 LTS
Release:        22.04
Codename:       jammy`,
    hint: `คำสั่งขึ้นต้นด้วย lsb_ หรือลองดูไฟล์ os-release ในไดเรกทอรี /etc`,
    patterns: [
      /^lsb_release(\s+-a)?$/i,
      /^cat\s+\/etc\/os-release$/i,
      /^hostnamectl(\s+status)?$/i
    ]
  },
  // Q2
  {
    simulatedOutput: `5.15.0-89-generic`,
    hint: `ใช้คำสั่ง uname พร้อม flag ที่ย่อมาจาก release (-r)`,
    patterns: [
      /^uname\s+-r$/i,
      /^uname\s+-a$/i,
      /^cat\s+\/proc\/version$/i
    ]
  },
  // Q3
  {
    simulatedOutput: `-rw------- 1 root root 11M Oct 18 14:22 /boot/vmlinuz-5.15.0-89-generic`,
    hint: `ใช้คำสั่ง ls -lh ตรวจสอบไฟล์ในไดเรกทอรี /boot/vmlinuz-... โดยใช้ subshell $(uname -r)`,
    patterns: [
      /^ls\s+-(lh|hl|l)\s+\/boot\/vmlinuz(-|\*)?(\$\(uname\s+-r\))?/i,
      /^ls\s+-lh\s+\/boot\/vmlinuz/i,
      /^ls\s+-l\s+\/boot\/vmlinuz/i,
      /^du\s+-h\s+\/boot\/vmlinuz/i
    ]
  },
  // Q4
  {
    simulatedOutput: `Architecture:                    x86_64
CPU op-mode(s):                  32-bit, 64-bit
Address sizes:                   39 bits physical, 48 bits virtual
Byte Order:                      Little Endian
CPU(s):                          8
On-line CPU(s) list:             0-7
Vendor ID:                       GenuineIntel
Model name:                      12th Gen Intel(R) Core(TM) i7-12700H
CPU family:                      6
Model:                           154
Thread(s) per core:              2
Core(s) per socket:              4
Socket(s):                       1`,
    hint: `ใช้คำสั่ง lscpu หรืออ่าน virtual file จาก /proc/cpuinfo`,
    patterns: [
      /^lscpu$/i,
      /^cat\s+\/proc\/cpuinfo$/i,
      /^less\s+\/proc\/cpuinfo$/i
    ]
  },
  // Q5
  {
    simulatedOutput: `[1] 48123 (running with niceness 19: least favorable priority)`,
    hint: `ใช้คำสั่ง nice กำหนดค่าความสำคัญสูงสุดทางบวก (-n 19) แล้วตามด้วย sleep`,
    patterns: [
      /^nice\s+-n\s*19\s+sleep\s+\d+(\s*&)?$/i,
      /^nice\s+-19\s+sleep\s+\d+(\s*&)?$/i,
      /^nice\s+--adjustment=19\s+sleep\s+\d+(\s*&)?$/i
    ]
  },
  // Q6
  {
    simulatedOutput: `sleep 100
^Z
[1]+  Stopped                 sleep 100
student@os-lab:~$ bg
[1]+ sleep 100 &`,
    hint: `รัน sleep 100 กด Ctrl+Z เพื่อหยุดชั่วคราว แล้วพิมพ์ bg เพื่อรันต่อใน background`,
    patterns: [
      /sleep\s+\d+.*(ctrl\+?z|\^z).*bg/i,
      /^sleep\s+\d+\s*&$/i,
      /^bg$/i,
      /^sleep\s+\d+$/i,
      /sleep.*->.*ctrl\+?z.*->.*bg/i,
      /sleep\s+\d+\s*;\s*bg/i
    ]
  },
  // Q7
  {
    simulatedOutput: `[1] 48135
student@os-lab:~$ kill %1
[1]+  Terminated              sleep 100`,
    hint: `รัน sleep 100 & แล้วตามด้วยคำสั่ง kill %1 เพื่อยุติ job หมายเลข 1`,
    patterns: [
      /sleep\s+\d+\s*&.*kill\s+%(1|sleep)/i,
      /^kill\s+%(1|sleep)$/i,
      /^killall\s+sleep$/i,
      /sleep\s+\d+\s*&.*kill/i
    ]
  },
  // Q8
  {
    simulatedOutput: `[1] 48141
[2] 48142
[3] 48143
student@os-lab:~$ fg %2
sleep 102`,
    hint: `รัน sleep 101 & sleep 102 & sleep 103 & แล้วใช้ fg %2 เพื่อดึง job 2 มา foreground`,
    patterns: [
      /sleep.*&.*sleep.*&.*fg\s+%2/i,
      /^fg\s+%2$/i,
      /^fg\s+2$/i
    ]
  },
  // Q9
  {
    simulatedOutput: `[1] 48145
[2] 48146
[3] 48147
student@os-lab:~$ kill %1
[1]   Terminated              sleep 101`,
    hint: `รัน 3 background jobs แล้วสั่ง kill %1 เพื่อ kill ตัวแรก`,
    patterns: [
      /sleep.*&.*sleep.*&.*kill\s+%1/i,
      /^kill\s+%1$/i
    ]
  },
  // Q10
  {
    simulatedOutput: `student:x:1000:1000:Student User,,,:/home/student:/bin/bash`,
    hint: `ใช้ pipe (|) เชื่อม cat /etc/passwd เข้ากับ grep home`,
    patterns: [
      /^cat\s+\/etc\/passwd\s*\|\s*grep\s+["']?home["']?$/i,
      /^grep\s+["']?home["']?\s+\/etc\/passwd$/i
    ]
  },
  // Q11
  {
    simulatedOutput: `up 3 hours, 42 minutes`,
    hint: `ใช้คำสั่ง uptime พร้อมออปชัน -p (pretty)`,
    patterns: [
      /^uptime\s+-p$/i,
      /^uptime$/i
    ]
  },
  // Q12
  {
    simulatedOutput: `MemTotal:       16315284 kB
MemFree:         8342116 kB
MemAvailable:   11245920 kB
Buffers:          345120 kB
Cached:          3145892 kB
SwapTotal:       2097148 kB
SwapFree:        2097148 kB`,
    hint: `อ่านข้อมูลจาก virtual file ใน /proc ชื่อ meminfo ด้วยคำสั่ง cat`,
    patterns: [
      /^cat\s+\/proc\/meminfo$/i,
      /^less\s+\/proc\/meminfo$/i,
      /^head(\s+-[n\d]+)?\s+\/proc\/meminfo$/i
    ]
  },
  // Q13
  {
    simulatedOutput: `               total        used        free      shared  buff/cache   available
Mem:            15Gi       4.2Gi       8.0Gi       320Mi       3.4Gi        11Gi
Swap:          2.0Gi          0B       2.0Gi`,
    hint: `ใช้คำสั่ง free พร้อมออปชัน -h (human-readable)`,
    patterns: [
      /^free\s+-h$/i,
      /^free\s+-m$/i,
      /^free$/i
    ]
  },
  // Q14
  {
    simulatedOutput: `Created testfile.txt -> Renamed to renamed.txt -> Removed renamed.txt successfully.`,
    hint: `ใช้ touch สร้างไฟล์, mv เปลี่ยนชื่อ, rm ลบไฟล์ (คั่นด้วย && หรือ ->)`,
    patterns: [
      /touch\s+\S+.*mv\s+\S+\s+\S+.*rm\s+\S+/i,
      /^touch\s+\S+$/i,
      /^rm\s+\S+$/i
    ]
  },
  // Q15
  {
    simulatedOutput: `Created directory testdir/ -> Renamed to renameddir/ -> Removed renameddir/ successfully.`,
    hint: `ใช้ mkdir สร้างโฟลเดอร์, mv เปลี่ยนชื่อ, rmdir หรือ rm -r เพื่อลบโฟลเดอร์`,
    patterns: [
      /mkdir\s+\S+.*mv\s+\S+\s+\S+.*rm(dir|\s+-r)\s+\S+/i,
      /^mkdir\s+\S+$/i,
      /^rmdir\s+\S+$/i
    ]
  },
  // Q16
  {
    simulatedOutput: `-r-------- 1 student student 0 Nov 10 01:00 secret.txt (Permission: 400)`,
    hint: `ใช้ touch สร้างไฟล์ แล้วตามด้วย chmod 400 (owner read-only)`,
    patterns: [
      /(touch\s+\S+\s*(&&|;)\s*)?chmod\s+400\s+\S+/i,
      /^chmod\s+400\s+\S+$/i,
      /^chmod\s+u=r,go=\s+\S+$/i
    ]
  },
  // Q17
  {
    simulatedOutput: `-rw-r--r-- 1 root root 0 Nov 10 01:00 rootfile.txt (Owner and group updated)`,
    hint: `ใช้คำสั่ง sudo chown root:root ชื่อไฟล์`,
    patterns: [
      /^(sudo\s+)?chown\s+root:root\s+\S+$/i,
      /^(sudo\s+)?chown\s+root\.root\s+\S+$/i
    ]
  },
  // Q18
  {
    simulatedOutput: `lrwxrwxrwx 1 student student 15 Nov 10 01:00 symlink_folder -> original_folder`,
    hint: `ใช้ mkdir สร้างโฟลเดอร์ แล้วตามด้วย ln -s original_folder symlink_folder`,
    patterns: [
      /(mkdir\s+\S+\s*(&&|;)\s*)?ln\s+-s\s+\S+\s+\S+/i,
      /^ln\s+-s\s+\S+\s+\S+$/i
    ]
  },
  // Q19
  {
    simulatedOutput: `Filesystem      Size  Used Avail Use% Mounted on
udev            7.8G     0  7.8G   0% /dev
tmpfs           1.6G  1.8M  1.6G   1% /run
/dev/sda1        98G   24G   69G  26% /
tmpfs           7.8G     0  7.8G   0% /dev/shm`,
    hint: `คำสั่ง df (disk free) พร้อมออปชัน -h`,
    patterns: [
      /^df\s+-h$/i,
      /^df\s+-H$/i,
      /^df$/i
    ]
  },
  // Q20
  {
    simulatedOutput: `944K    /usr/share/dict/american-english`,
    hint: `ใช้คำสั่ง du (disk usage) พร้อม flag -h ตามด้วย path ของไฟล์`,
    patterns: [
      /^du\s+-h\s+\/usr\/share\/dict\/american-english$/i,
      /^du\s+-h\s+\S*american-english$/i,
      /^du\s+\/usr\/share\/dict\/american-english$/i
    ]
  },
  // Q21
  {
    simulatedOutput: `e2fsck 1.46.5 (30-Dec-2021)
Pass 1: Checking inodes, blocks, and sizes
Pass 2: Checking directory structure
Pass 3: Checking directory connectivity
Pass 4: Checking reference counts
Pass 5: Checking group summary information
/dev/sda1: 245120/6553600 files (0.2% non-contiguous), 3124500/26214400 blocks`,
    hint: `ใช้คำสั่ง sudo fsck พร้อม flag -f และระบุพาร์ติชันเช่น /dev/sda1`,
    patterns: [
      /^(sudo\s+)?fsck(\s+-f)?\s+\/dev\/sd[a-z]\d*$/i,
      /^(sudo\s+)?fsck/i
    ]
  },
  // Q22
  {
    simulatedOutput: `/home/student/documents/filename.txt
/var/backup/filename.txt`,
    hint: `ใช้คำสั่ง find ค้นหาจาก root (/) ด้วย -name "filename.txt"`,
    patterns: [
      /^find\s+(\/|\.|\S+)\s+-name\s+["']?filename(\.txt)?["']?$/i,
      /^find\s+-name\s+["']?filename(\.txt)?["']?$/i,
      /^locate\s+filename/i
    ]
  },
  // Q23
  {
    simulatedOutput: `Changing password for student.
Current password: 
New password: 
Retype new password: 
passwd: password updated successfully`,
    hint: `พิมพ์คำสั่ง passwd สั้นๆ`,
    patterns: [
      /^passwd$/i,
      /^sudo\s+passwd$/i
    ]
  },
  // Q24
  {
    simulatedOutput: `student root guest`,
    hint: `คำสั่ง users เพื่อดูรายชื่อ user ที่กำลังล็อกอิน`,
    patterns: [
      /^users$/i,
      /^who\s+-q$/i
    ]
  },
  // Q25
  {
    simulatedOutput: ` 01:42:01 up  3:42,  3 users,  load average: 0.14, 0.08, 0.03
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
student  pts/0    192.168.1.10     00:15    0.00s  0.25s  0.01s w
root     pts/1    192.168.1.15     01:10    4:12   0.05s  0.05s bash`,
    hint: `คำสั่งอักษรตัวเดียวคือ 'w' (หรือ who -u)`,
    patterns: [
      /^w$/i,
      /^who\s+-u$/i,
      /^who$/i
    ]
  },
  // Q26
  {
    simulatedOutput: `New password: 
Retype new password: 
passwd: password updated successfully
root account is now enabled.`,
    hint: `ใช้ sudo passwd root เพื่อกำหนดรหัสผ่านและเปิดใช้งาน root`,
    patterns: [
      /^sudo\s+passwd\s+root$/i,
      /^passwd\s+root$/i
    ]
  },
  // Q27
  {
    simulatedOutput: `Adding user 'testuser' ...
Adding new group 'testuser' (1001) ...
Creating home directory '/home/testuser' ...
Removing user 'testuser' ...
Removing home directory '/home/testuser' ... Done.`,
    hint: `ใช้ sudo adduser testuser && sudo deluser --remove-home testuser`,
    patterns: [
      /adduser\s+\S+.*deluser/i,
      /useradd\s+\S+.*userdel/i,
      /^sudo\s+adduser\s+\S+$/i,
      /^sudo\s+useradd\s+\S+$/i
    ]
  },
  // Q28
  {
    simulatedOutput: `The authenticity of host 'hostname_or_ip' can't be established.
ECDSA key fingerprint is SHA256:abcd1234efgh5678...
Connected to remote Linux server via Secure Shell.`,
    hint: `ใช้ ssh ตามด้วย username@hostname_or_ip`,
    patterns: [
      /^ssh\s+\S+@\S+$/i,
      /^ssh\s+\S+$/i
    ]
  },
  // Q29
  {
    simulatedOutput: `Connected to hostname_or_ip.
sftp> put localfile.txt
Uploading localfile.txt to /home/username/localfile.txt
100% 1024KB   4.2MB/s   00:00`,
    hint: `ใช้คำสั่ง sftp username@hostname_or_ip หรือ scp`,
    patterns: [
      /^sftp\s+\S+@\S+$/i,
      /^sftp\s+\S+$/i,
      /^scp\s+\S+\s+\S+@\S+:/i,
      /^ftp\s+\S+/i
    ]
  },
  // Q30
  {
    simulatedOutput: `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN
    inet 127.0.0.1/8 scope host lo
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP
    inet 192.168.1.150/24 brd 192.168.1.255 scope global dynamic eth0`,
    hint: `ใช้คำสั่ง ip a หรือ ip addr show หรือ hostname -I`,
    patterns: [
      /^ip\s+(a|addr|address)(\s+show)?$/i,
      /^hostname\s+-I$/i,
      /^ifconfig$/i
    ]
  },
  // Q31
  {
    simulatedOutput: `Server:         1.1.1.1
Address:        1.1.1.1#53

Non-authoritative answer:
Name:   google.com
Address: 142.250.190.46
Name:   google.com
Address: 2607:f8b0:4004:800::200e`,
    hint: `ใช้คำสั่ง nslookup google.com หรือ host google.com หรือ dig google.com`,
    patterns: [
      /^nslookup\s+google\.com$/i,
      /^host\s+google\.com$/i,
      /^dig\s+google\.com$/i
    ]
  },
  // Q32
  {
    simulatedOutput: `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP mode DEFAULT
    link/ether 52:54:00:12:34:56 brd ff:ff:ff:ff:ff:ff`,
    hint: `ใช้คำสั่ง ip link show หรือ ifconfig`,
    patterns: [
      /^ip\s+link(\s+show)?$/i,
      /^ifconfig$/i,
      /^ip\s+l$/i
    ]
  },
  // Q33
  {
    simulatedOutput: `PING google.com (142.250.190.46) 56(84) bytes of data.
64 bytes from 142.250.190.46: icmp_seq=1 ttl=115 time=14.2 ms
64 bytes from 142.250.190.46: icmp_seq=2 ttl=115 time=13.8 ms
64 bytes from 142.250.190.46: icmp_seq=3 ttl=115 time=14.5 ms
64 bytes from 142.250.190.46: icmp_seq=4 ttl=115 time=14.0 ms

--- google.com ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 13.812/14.125/14.510/0.252 ms`,
    hint: `ใช้คำสั่ง ping google.com พร้อมออปชัน -c 4`,
    patterns: [
      /^ping\s+-c\s*4\s+google\.com$/i,
      /^ping\s+google\.com(\s+-c\s*4)?$/i
    ]
  },
  // Q34
  {
    simulatedOutput: `job 1 at Tue Nov 11 01:00:00 2026`,
    hint: `ใช้ echo สั่ง wget ผ่าน pipe ไปยัง at 1:00 AM tomorrow`,
    patterns: [
      /echo\s+["']?wget\s+https?:\/\/cache111\.com\/test\.zip["']?\s*\|\s*at\s+1:?00?\s*(am)?\s*tomorrow/i,
      /at\s+1:?00?\s*(am)?\s*tomorrow/i
    ]
  },
  // Q35
  {
    simulatedOutput: `MAN(1)                        Manual pager utils                        MAN(1)

NAME
       man - an interface to the system reference manuals

SYNOPSIS
       man [man options] [[section] page ...] ...
       man -k [apropos options] regexp ...

DESCRIPTION
       man is the system's manual pager. Each page argument given to man is
       normally the name of a program, utility or function.`,
    hint: `เปิด man page ของตัวคำสั่ง man เอง`,
    patterns: [
      /^man\s+man$/i
    ]
  },
  // Q36
  {
    simulatedOutput: `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin`,
    hint: `ใช้คำสั่ง head พร้อมออปชัน -n 10 (หรือ -10) ตามด้วย /etc/passwd`,
    patterns: [
      /^head\s+(-n\s*10|-10)?\s*\/etc\/passwd$/i,
      /^head\s+\/etc\/passwd$/i
    ]
  },
  // Q37
  {
    simulatedOutput: `systemd-resolve:x:102:103:systemd Resolver,,,:/run/systemd:/usr/sbin/nologin
messagebus:x:103:105::/nonexistent:/usr/sbin/nologin
syslog:x:104:107::/home/syslog:/usr/sbin/nologin
_apt:x:105:65534::/nonexistent:/usr/sbin/nologin
uuidd:x:106:108::/run/uuidd:/usr/sbin/nologin
tcpdump:x:107:109::/nonexistent:/usr/sbin/nologin
sshd:x:108:65534::/run/sshd:/usr/sbin/nologin
landscape:x:109:112::/var/lib/landscape:/usr/sbin/nologin
pollinate:x:110:1::/var/cache/pollinate:/bin/false
student:x:1000:1000:Student User,,,:/home/student:/bin/bash`,
    hint: `ใช้คำสั่ง tail พร้อมออปชัน -n 10 (หรือ -10) ตามด้วย /etc/passwd`,
    patterns: [
      /^tail\s+(-n\s*10|-10)?\s*\/etc\/passwd$/i,
      /^tail\s+\/etc\/passwd$/i
    ]
  },
  // Q38
  {
    simulatedOutput: `A
A's
AA's
AB's
ABM's
AC's
ACTH's
AI's
AIDS's
AM's
--More--(0%)`,
    hint: `ใช้คำสั่ง more หรือ less ตามด้วย /usr/share/dict/american-english`,
    patterns: [
      /^(more|less)\s+\/usr\/share\/dict\/american-english$/i,
      /^(more|less)\s+\S*american-english$/i
    ]
  },
  // Q39
  {
    simulatedOutput: `sys:x:3:3:sys:/dev:/usr/sbin/nologin
syslog:x:104:107::/home/syslog:/usr/sbin/nologin`,
    hint: `ใช้คำสั่ง grep "sys" /etc/passwd`,
    patterns: [
      /^grep\s+["']?sys["']?\s+\/etc\/passwd$/i
    ]
  },
  // Q40
  {
    simulatedOutput: `Auckland
Cleveland
Disneyland
England
Finland
Greenland
Holland
Iceland
Ireland
Maryland
Newfoundland
New Zealand
Poland
Queensland
Scotland
Switzerland
Thailand`,
    hint: `ใช้ regular expression $ เพื่อระบุท้ายคำ: grep "land$" /usr/share/dict/american-english`,
    patterns: [
      /^grep\s+["']?land\$["']?\s+\/usr\/share\/dict\/american-english$/i,
      /^grep\s+["']?land\$["']?\s+\S*american-english$/i
    ]
  },
  // Q41
  {
    simulatedOutput: `102401 /usr/share/dict/american-english`,
    hint: `ใช้คำสั่ง wc พร้อม flag -l (line count)`,
    patterns: [
      /^wc\s+-l\s+\/usr\/share\/dict\/american-english$/i,
      /^wc\s+-l\s+\S*american-english$/i
    ]
  },
  // Q42
  {
    simulatedOutput: `[GNU nano 6.2: /usr/share/dict/american-english]
...
micrometer
micrometer's
micrometers
> microcomputer <
microcomputer's
microcomputers
...
^G Help  ^O WriteOut  ^W Where Is  ^K Cut  ^J Justify  ^C Cur Pos  ^X Exit`,
    hint: `ใช้คำสั่ง nano /usr/share/dict/american-english (ในโปรแกรมกด Ctrl+W เพื่อค้นหา)`,
    patterns: [
      /^nano\s+\/usr\/share\/dict\/american-english$/i,
      /^nano\s+\S*american-english$/i,
      /^vim?\s+\/usr\/share\/dict\/american-english$/i
    ]
  },
  // Q43
  {
    simulatedOutput: `00000000  4a 6f 68 6e                                       |John|
00000004`,
    hint: `echo -n "John" > name.txt && hexdump -C name.txt (หรือ xxd name.txt)`,
    patterns: [
      /echo.*name\.txt\s*(&&|;)\s*hexdump\s+-C\s+name\.txt/i,
      /^hexdump\s+-C\s+name\.txt$/i,
      /^xxd\s+name\.txt$/i,
      /hexdump\s+-C/i
    ]
  },
  // Q44
  {
    simulatedOutput: `gpg: symmetric encryption of 'name.txt' succeeded.
Created: name.txt.gpg`,
    hint: `ใช้คำสั่ง gpg -c name.txt เพื่อใส่รหัสผ่านและเข้ารหัส symmetric`,
    patterns: [
      /echo.*name\.txt\s*(&&|;)\s*gpg\s+-c\s+name\.txt/i,
      /^gpg\s+-c\s+name\.txt$/i,
      /^gpg\s+-c/i
    ]
  },
  // Q45
  {
    simulatedOutput: `gcc hello.c -o hello
./hello
Hello, World!`,
    hint: `คอมไพล์โค้ดด้วย gcc hello.c -o hello แล้วรันด้วย ./hello`,
    patterns: [
      /gcc\s+hello\.c\s+-o\s+hello\s*(&&|;)\s*\.\/hello/i,
      /^gcc\s+hello\.c(\s+-o\s+hello)?$/i,
      /^\.\/hello$/i,
      /gcc.*&&.*\.\/hello/i
    ]
  },
  // Q46
  {
    simulatedOutput: `nohup: appending output to 'nohup.out'
[1] 48210 (Process running independently of terminal session)`,
    hint: `ใช้คำสั่ง nohup ตามด้วยโปรแกรมและเครื่องหมาย & เช่น nohup ./myprogram &`,
    patterns: [
      /^nohup\s+\S+(\s+&)?$/i,
      /^disown/i,
      /^tmux/i,
      /^screen/i
    ]
  },
  // Q47
  {
    simulatedOutput: `Shutdown scheduled for Tue 2026-11-10 01:52:00 +07, use 'shutdown -c' to cancel.
Broadcast message from root@os-lab (pts/0):
The system is going down for poweroff at Tue 2026-11-10 01:52:00 +07!`,
    hint: `ใช้ sudo shutdown +10 เพื่อตั้งเวลา 10 นาที`,
    patterns: [
      /^(sudo\s+)?shutdown\s+\+10$/i
    ]
  },
  // Q48
  {
    simulatedOutput: `Broadcast message from root@os-lab (pts/0):
The system shutdown has been cancelled!`,
    hint: `ใช้คำสั่ง sudo shutdown -c เพื่อยกเลิก (cancel)`,
    patterns: [
      /^(sudo\s+)?shutdown\s+-c$/i
    ]
  },
  // Q49
  {
    simulatedOutput: `foldername/
foldername/file1.txt
foldername/notes.md
Created archive foldername.tar.gz (compressed with gzip)`,
    hint: `ใช้คำสั่ง tar -czvf foldername.tar.gz foldername/`,
    patterns: [
      /^tar\s+-(czvf|cvzf|czf)\s+foldername\.tar\.gz\s+foldername\/?$/i,
      /^tar\s+(czvf|cvzf|czf)\s+foldername\.tar\.gz\s+foldername\/?$/i
    ]
  },
  // Q50
  {
    simulatedOutput: `b8c4d2e5f1029384756a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcd  foldername.tar.gz`,
    hint: `ใช้คำสั่ง sha256sum foldername.tar.gz (หรือ md5sum)`,
    patterns: [
      /^sha256sum\s+foldername\.tar\.gz$/i,
      /^md5sum\s+foldername\.tar\.gz$/i,
      /^shasum\s+-a\s*256\s+foldername\.tar\.gz$/i
    ]
  },
  // Q51
  {
    simulatedOutput: `  adding: foldername/ (stored 0%)
  adding: foldername/file1.txt (deflated 62%)
  adding: foldername/notes.md (deflated 45%)`,
    hint: `ใช้คำสั่ง zip -r foldername.zip foldername/`,
    patterns: [
      /^zip\s+-r\s+foldername\.zip\s+foldername\/?$/i
    ]
  },
  // Q52
  {
    simulatedOutput: `4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a  foldername.zip`,
    hint: `ใช้คำสั่ง sha256sum foldername.zip (หรือ md5sum)`,
    patterns: [
      /^sha256sum\s+foldername\.zip$/i,
      /^md5sum\s+foldername\.zip$/i
    ]
  },
  // Q53
  {
    simulatedOutput: `Combined contents written to combined.txt.
cat combined.txt:
[Content of file1.txt]
[Content of file2.txt]`,
    hint: `cat file1.txt > combined.txt && cat file2.txt >> combined.txt`,
    patterns: [
      /cat\s+\S+\s*>\s*\S+\s*(&&|;)\s*cat\s+\S+\s*>>\s*\S+/i,
      /^cat\s+file1(\.txt)?\s+file2(\.txt)?\s*>\s*combined(\.txt)?$/i
    ]
  },
  // Q54
  {
    simulatedOutput: `Split /usr/share/dict/american-english into 10 chunks:
x00 (10241 lines)   x01 (10240 lines)   x02 (10240 lines)   x03 (10240 lines)
x04 (10240 lines)   x05 (10240 lines)   x06 (10240 lines)   x07 (10240 lines)
x08 (10240 lines)   x09 (10240 lines)`,
    hint: `ใช้คำสั่ง split -n 10 -d /usr/share/dict/american-english x`,
    patterns: [
      /^split\s+(-n\s*10|-d\s+-n\s*10|-n\s*10\s+-d|-d)\s+(-d\s+)?\/usr\/share\/dict\/american-english\s+x$/i,
      /^split\s+-l\s+\d+\s+-d\s+\/usr\/share\/dict\/american-english\s+x$/i,
      /^split.*\/usr\/share\/dict\/american-english/i
    ]
  },
  // Q55
  {
    simulatedOutput: `root
daemon
bin
sys
sync
games
man
lp
student`,
    hint: `ใช้ cut -d: -f1 /etc/passwd หรือ awk -F: '{print $1}' /etc/passwd`,
    patterns: [
      /^cut\s+(-d\s*[:'"]*|--delimiter=[:'"]*)\s*(-f\s*1|--fields=1)\s+\/etc\/passwd$/i,
      /^cut\s+(-d\s*['"]?:['"]?|-d\s*:)\s+-f\s*1\s+\/etc\/passwd$/i,
      /^cut\s+(-f\s*1|--fields=1)\s+(-d\s*['"]?:['"]?|-d\s*:)\s+\/etc\/passwd$/i,
      /^awk\s+-F\s*['"]?:['"]?\s*['"]\{print\s+\$1\}['"]\s+\/etc\/passwd$/i,
      /^awk\s+-F:\s*['"]\{print\s+\$1\}['"]\s+\/etc\/passwd$/i
    ]
  },
  // Q56
  {
    simulatedOutput: `Rank    Owner   Job     File(s)                         Total Size
active  student 104     lab_report.pdf                  412850 bytes
1st     student 105     assignment_diagram.png          891200 bytes`,
    hint: `ใช้คำสั่ง lpq (Line Printer Queue) หรือ lpstat -p`,
    patterns: [
      /^lpq$/i,
      /^lpstat(\s+-p)?$/i
    ]
  },
  // Q57
  {
    simulatedOutput: `Tue Nov 10 01:42:30 +07 2026`,
    hint: `คำสั่งสั้นๆ 4 ตัวอักษรคือ 'date'`,
    patterns: [
      /^date(\s+.*)?$/i
    ]
  },
  // Q58
  {
    simulatedOutput: `    November 2026   
Su Mo Tu We Th Fr Sa
 1  2  3  4  5  6  7
 8  9 10 11 12 13 14
15 16 17 18 19 20 21
22 23 24 25 26 27 28
29 30`,
    hint: `คำสั่ง cal (หรือ ncal) เพื่อดูปฏิทินของเดือนปัจจุบัน`,
    patterns: [
      /^cal$/i,
      /^ncal$/i
    ]
  }
];

const compiledQuestions = quiz1.map((q, idx) => {
  const meta = customDetails[idx] || {};
  const targetAns = q.choices[q.correct_key];
  return {
    id: idx + 1,
    db_id: q.id,
    section: q.section_name,
    question: q.question,
    canonical_answer: targetAns,
    hint: meta.hint || `ใช้คำสั่งที่เกี่ยวข้องกับ ${q.question}`,
    simulated_output: meta.simulatedOutput || `Command executed successfully.`,
    patterns: meta.patterns ? meta.patterns.map(p => p.source) : [],
    explanation: q.explanation
  };
});

fs.writeFileSync('terminal_questions_compiled.json', JSON.stringify(compiledQuestions, null, 2), 'utf8');
console.log('Successfully compiled', compiledQuestions.length, 'questions to terminal_questions_compiled.json');
