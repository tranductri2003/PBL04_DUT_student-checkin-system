# PBL04_DUT-Student-CheckIn-System
# Week 1
## Java revise this:
1. GUI + Event handling
2. Multi-threading
3. Input Ouput stream programming
    - InputStream, OutputStream (Byte stream) (1 byte)
    - Reader, Writer (Char stream) (1 char = 2 bytes)
4. Database connection

## Network
```
IP each class:
Class A: 0.0.0.0        127.0.0.0
Class B: 128.0.0.0      191.255.0.0
Class C: 192.0.0.0      223.255.255.0
Class D: 224.0.0.0      239.255.255.0	(multicast purpose)
Class E: 240.0.0.0      255.0.0.0	(future use)
```
```
Subnet mask:
Class A: 255.0.0.0  (1 byte for NET, 3 for HOST)
Class B: 255.255.0.0 (2, 2)
Class C: 255.255.255.0 (3, 1)
```
## Chapters
1. Computer network
2. Devices and standard connection
3. Basic protocols
4. Java
5. Socket programming with TCP
6. Socket programming with UDP
7. Database programming
8. Application programming (JSP, SERVLET, MVC)

Model, View, Control
Database,, Application

# Week 2
## CHAPTER 1: COMPUTER NETWORK
1. Khai niem va muc dich ket noi mang
Tap hop 2 hay nhieu may tinh ket noi voi nhau, chia se tai nguyen phan cung va phan mem.
De ket noi can co: moi truong duong truyen (ket noi) va cc quy tac quy dinh.
GSM network

2. Dac trung ky thuat cua mang may tinh
- Duong truyen

- Ky thuat chuyen mach
    - .. Dien (chuyen mach kenh)
    - .. thong bao
    - .. goi
- Kien truc mang
    - hinh trang mang (network topology)
    - giao thuc mang (network protocol)
- He dieu hanh mang

3. Phan loai mang
Chia theo khoang cach dia ly: LAN, MAN (mang do thi), WAN (mang dien rong), GAN, Intranet, Internet (mang toan cau)

Chia theo kien truc mang su dung: Bus, Star, Ring

Chia theo ky thuat chuyen mach: ...

Chia theo he dieu hanh mang: Client/Server hoac Windows, Unix,...

4. Chuan hoa mang may tinh OSI
7 tang: Physical Datalink Network Transport Session Presentation Application

Lap trinh tren tang Transport

B
1. Hub, Repeater

2. Bridge, Swithes
Logic Link Control, Media Access Control

3. Router
IP, Protocol IP, IP packet, subnets, routing
```
Layer's data      OSI                   TCP/IP
Data            Application --------- Application
Data            Presentation
Data            Session
Segment         Transport  ---------- Transport
Packets         Network    ---------- Internet
Frames          Data link  ---------- Network Access
Bits            Physical             
```
**Tim hieu Cach thuc hoat dong giao thuc IP (13 buoc)**
https://web.stanford.edu/class/msande91si/www-spr04/readings/week1/InternetWhitepaper.htm#:~:text=IP%20directs%20packets%20to%20a%20specific%20computer%20using%20an%20IP%20address.&text=Converts%20binary%20packet%20data%20to,for%20phone%20lines%2C%20etc.)&text=The%20message%20would%20start%20at,and%20work%20it's%20way%20downward.

http://eldata15.topica.edu.vn/Hoclieu/IT102/Giao%20trinh/07_HOU_IT102_Bai5_v1.0013103214.pdf

Lap trinh vien lap trinh tren 3 tang
Presentation (View)
Application Logic (Controller)
Data management (Model: DA, BO, BEAN)

# Week 3

# Week 4 2021Feb23
## Cac giao thuc co ban
- TCP (Transmission Control Protocol) thêm 20bytes vô IP Packet
- UDP (User Datagram Protocol) thêm 8bytes vô IP Packet
- IP (Internet Protocol)
- ICMP (Internet Control Message Protocol)
- ARP (Address Resolution Protocol)
- RARP (Reverse Address Resolution Protocol)

Protocol has 4 task:
1. Request
2. Indication: Event recieved, waiting to process
3. Response: 
4. Confirm:

```
Request --> Indication
                |
Confirm <-- Response
```

## Type of communication protocol
- Giao thuc khong ket noi: chuyen goi du lieu den layer ma no quan he truc tiep, khong can biet di duong nao de toi noi nhan
- Giao thuc co ket noi: trao doi du lieu can than hon. Gui yeu cau ket noi ben nhan, nhan 
thu tuc hand-shake, sau do trao doi thong tin. Cuoi cung la ket thuc ket noi.
1. Bắt đầu kết nối
2. Nhận dữ liệu
3. Kết thúc kết nối.

## Co che kiem soat loi cua Protocol:
Dung phuong phap ARP (Automatic Repeat reQuest):

### Idle-RQ method:
Stop and Wait, Send and Wait. Lam viec voi ket noi half-duplex.

Moi lan chi gui 1 packet.
- Kieu an:
    - Nhan thanh cong goi tin (1)
    - Mat goi tin (2)
    - Mat bao nhan ACK (3)
- Kieu hien:
    - Nhan thanh cong goi tin (1)
    - Mat goi tin (2)
    - Mat bao nhan ACK (3)

#### Kieu an
1. Nhan thanh cong - Send ACK
2. Goi tin mat - khong gui gi ca
3. Nhan thanh cong - Send ACK - lost ACK

#### Kieu hien
1. (giong)
2. Goi tin mat - Send NAK
3. (giong)

- Kieu an: Chi quan tam den goi tin nhan duoc
- Kieu hien: Co quan tam den goi tin bi mat

### Continuous-RQ method:
- Selective Repeat: Mat 1 goi truyen lai 1 goi
    - Kieu an
    - Kieu hien

    - Hoi dap kieu an:
        Nguoi gui se lien tuc gui N, N+1, N+2, ... va se theo doi trang thai tra ve ACK cua cac goi tin.

        ```
        N   (queue = [])
        N+1 (queue = [N])
        N+2 (queue = [N, N+1]) (receive ACK for N) -> queue = [N+1]
        N+3 (queue = [N+1, N+2]) -> (ACK N+2) -> q = [N+1]
        N+1 (queue = [N+3]) (resend because no ACK)

        Sending side:
        ACK N, ACK N+2 => lost packet N+1
        ```
    
    - Hoi dap kieu hien:
        Nhu tren, su dung thu tu cua hang cho
        ```
        Send        Receive         Response
        N
        N+1
        N+2         N               ACK N
        N+3         N+2             NAK N+1 (N+2 has arrived, but no N+1, meaning it has been lost. 'Kieu hien' cares about lost packet.)
        ...
        ```

- Goback N: Mat 1 goi truyen lai N goi
    - Kieu an
    - Kieu hien
```
                    Sender Window size     Receiever Window size
IDLE-RQ             1                       1
SELECTIVE REPAT     K                       K
GOBACK-N            K                       1
```

# Week 5 2021 Mar 02
## Tầng mạng
- Giao thức IP 
- Cấu trúc gói tin IP
- Địa chỉ IP
- Dịch vụ DHCP: cấp phát IP động
- Giao thức ICMP: kèm với IP, đưa ra thông báo lỗi

## IP
- Mọt giao thức ở tầng mạng (thứ 3), giao thức không kết nối
- Hai chức năng:
	- Chọn đường (Routing)
	- CHuyển tiếp (Forwarding)
- IP packet = payload + IP Header (Ver, IHL, TOS, packet Length,..)

### Properties
- Không tin cậy, nhanh
- Giao thức không liên kết

### Hoạt động của giao thức IP
#### Ở máy nguồn:
1. Tạo một IP datagram dựa trên tham số nhận được
2. Tính checksum và ghép vào header
3. Ra quyết định chọn đường: hoạt là trạm đích nằm trên cùng mạng hoặc một gateway sẽ được chọn cho chặng tiếp theo
4. Chuyển gói tin xuống tầng dưới để truyền qua mạng

#### Đối với router
1. Tính checksum, sai thì loại bỏ
2. Giảm giá trị tham số Time to live, nếu thời gian đã hết, bỏ gói tin
3. Ra quyết định chọn đường
4. Phân đoạn gói tin
5. Kiến tạo lại IP Header, bao gồm giá trị mới của Time-to-live, fragmentation và checksum
6. Chuyển datagram xuống tầng dưới để chuyển qua mạng

#### ..
1. Tính checksum, sai thì loại bỏ gói tin
2. Tập hợp các đoạn của gói tin (nếu có phân đoạn)
3. Chuyển dữ liệu và các tham số điều khiển lên tầng trên

### Cấu trúc gói tin IP

### Địa chỉ IP
- Để địa chỉ không trùng nhau
- Network Information Center (NIC) phân địa chỉ mạng (Net ID), tổ chức quản lý internet từng quốc gia phân phối (Host ID)

[img "địa chỉ ip các lớp"]

### Các dạng địa chỉ
- Địa chỉ máy trạm là địa chỉ MAC
- Địa chỉ quảng bá: dùng để gửi cho tất cả máy trạm, toàn bit 1 ứng với host id, quảng bá mạng..
- 

### Mặt nạ mạng
- Che Net ID lại
- net ID = IP add & subnet mask
- Cùng mạng sẽ cùng NETID, SubnetMask, và khác host ID.

### Các địa chỉ đặc biệt
- Địa chỉ loopback là `127.x.x.x`
- Địa chỉ broadcast dùng để quảng bá mạng mình cho các mạng khác biết.
	 - Mục đích như là cập nhật bảng định tuyến

- Private address:

### Các giao thức điều khiển
- 
- ARP: các địa chỉ IP được dùng để định danh các host và mạng ở tầng mạng của OSI, chúng không phải địa chỉ vật lý
- RARP: ...

### Tầng giao vận

### Tổng quan UDP
- Sử dụng vì:
	- Không cần thiết lập liên kết
	- Phần đầu đoạn tin nhỏ
	- Không cần lưu lại trạng thái liên kết ở bên gửi và bên nhận
	- Không có quản lý tắc nghẽn: UDP gửi nhanh, nhiều nhất có thể

### Quản lý liên kết:
- Chu trình làm việc của TCP:
	1. Thiết lập liên kết
	2. Truyền/nhận dữ liêu
	3. Đóng liên két
#### Khởi tạo liên kết
1. Bước 1: A gưi SYN cho B
	- chỉ ra giá trị seq # của  A
	- không có dữ liệu
2. Bước 2: B nhận SYN, trả lời bằng SYNACK
	- B khơi tạo vùng đệm
	- Chỉ ra giá trị khởi tạo seq # của B
3. Bước 3: A nhận SYNACK, trả lời ACK, có thể kèm theo dữ liệu

#### Đóng liên kết
1. A gửi FIN cho B
2. B nhận FIN, trả lời ACK, đóng liên kết và gửi FIN
3. A nhận FIN, trả lời ACK, waiting mode
4. B nhận ACK, đóng liên kết

// TODO: Đọc chương 8 lập trình luồng vào ra java
// Đừng dùng Scanner.

# Tuan sau kiem tra trac nghiem Giua ky
# Week 6 2021Mar09
- Luồng nhập xuất hướng Byte (8 bit)
	`InputStream/OutputStream`
- Luồng nhập xuất hướng ký tự (16 bit)
	`Reader/Writer`

## Bai Tap
1. Nhap so tinh tong va tich cac chu so
2. Nhap mot chuoi ky tu tuy y, sau do thuc hien:
	- In ra chuoi dao nguoc cua chuoi da cho (reverse)
	- In ra chuỗi hoa của chuỗi đã cho
	- In ra chuỗi thường của chỗi đã cho
	- In ra chuỗi vừa hoa vừa thường
	- Đếm số word trong chuỗi

`../java_xuly/Read*.java'

# Week 7 2021Mar10
`java_networking/time/TCPTimeClient.java' and `java_networking/time/TCPTimeServer.java'

# Week 8 2021Mar23
## Concurrency programming
[ORACLE Java Doc](https://docs.oracle.com/javase/tutorial/essential/concurrency/)

### Processes and Threads
- "Time slicing": a feature that allow sharing processing time for a single core among processes and threads
- It's common for a computer system to have multiple processors or processors with multiple execution cores. But concurrency is possible even on simple systems.

#### Processes
- Is a instance of computer program, has a self-contained execution environment, has its own distinct memory space in the system at execution time.
- To communicate between processes, most OS supports *Inter Process Communication (IPC)* resources, such as pipes and sockets. IPC is also used for communication of processes on different systems.
- A Java application runs as single process, but can create additional processes using `ProcessBuilder`.

#### Threads
- "Lightweight processes": Creating a new thread requires fewer resources than creating a new process
- Threads exist within a process, share the process's resources.
- From the application programmer's POV, you start with one thread that is the *main thread*, and this thread is capable of creating more threads.

#### Thread objects
There are 2 basic strategies for using `Thread` object:
- To directly control thread creation and management, instantiate `Thread` each time the application needs to initiate an asynchronous task.
- To abstract thread management, pass the application's task to an *executor*. (which will be discussed in high-level concurrency objects)

##### Defining and Starting a Thread
To instantiate a `Thread`, code that will run in that thread must be provided. There are two ways to do this:

1. Provide an object that implements `Runnable`, with the code in its `run()` method. The object is then passed to the `Thread` constructor.
```java
public class TestRunnable implements Runnable {
    public void run() {
        System.out.println("From a thread");
    }
    public static void main(String args[]) {
        (new Thread(new TestRunnable())).start();
    }
}
```

2. Subclass `Thread`, then put the code in its `run()` method. Then call `start()` as normal.
```java
public class TestThread extends Thread {
    public void run() {
        System.out.println("From a thread");
    }
    public static void main(String args[]) {
        (new TestThread()).start();
    }
}
```

- You need to invoke `Thread.start()` to start the new thread.
- By using the first idiom, you can extends other class, because Java does not allow **multiple inheritance**. Applicable to high-level thread management APIs.
- You can use the second idiom if you are writing simple program.

#### Thread.sleep()
- There are two overloaded versions of `sleep`: one specifies milisecond and the other is nanosecond.
- Not guaranteed to be precise, can be terminated by interrupts.
- Function that calls `Thread.sleep()` should declare `throws InterruptedException` or handle it. This is an exception that `sleep` throws when another thread interrupts the current thread while `sleep` is active.

#### Interrupts
##### Sendint interrupts
A thread invoking `interrupt` on `Thread` object for the thread to be interrupted.

##### Supporting interruption
A thread support its own interruption, for example, after it catches `InterruptedException` it simply returns from the `run` method.

- For thread that calls `sleep()`
```java
try {
    Thread.sleep(4000);
} catch (InterruptedException e) {
    // We have been interrupted
    return;
}
```
- For other threads, periodically invoke `Thread.interrupted()` which return `true` if an interrupt has been received.
```java
if (Thread.interrupted()) {
    // We have been interrupted
    return;
}
```
In more complex application, it might make more sense to throw an `InterruptedException`
```java
if (Thread.interrupted()) {
    throw new InterruptedException();
}
```
This allows interrupt handling code to be centralized in a `catch` clause.

##### The interrupt Status flag
- Interrupt mechanism is implemented using an internal flag known as *interrupt flag*. Invoking `interrupts()` sets this flag.
- If the static `Thread.interrupted()` is called, the status of this flag is return and the flag will be reset.
- If the non-static `.isInterrupted()` is called, the flag won't be reset.

By convention, any method that exits by throwing an `InterruptedException` clears interrupt status when it does so. However, it's always possible that interrupt status will immediately be set again, by another thread invoking interrupt.

https://docs.oracle.com/javase/tutorial/essential/concurrency/interrupt.html


# Week 7 - 2021 March 30
## DatagramPacket
- Nhận: hai
Phải chuyển các byte thành dạng dữ liệu khác trước khi xử lý dữ liệu.

## Các phương thức nhận thông tin từ DatagramPacket
`public String(byte[] buffer, String encoding)`
- Tham số đầu tiên buffer là mảng các byte chứa dữ liệu từ datagram
- Tham só thứ hai cho biết cách thức mã hóa xâu ký tự

## DatagramSocket
- `void receive(DatagramPacket dp) throws IOException`
Đọc và lưu nội dung tỏng packet UDP xác định
- `void send(DatagramPacket dp) throws IOException`
Phương thức gửi một gói tin
- `void setSoTimeOut(int timeout)`
Thiết lập giá trị tùy chọn của socket


# 2021 April 20
## Model
Lớp chịu trách nhiệm quản lý dữ liệu

Hỗ trợ các cách thwucs xử lý dữ liệu, hỗ trợ khả năng giao tiếp và trao đổi dữ liệu giữa các đối tượng. Model sẽ là JavaBean, Enterprise JavaBean hay Web Service.

Tách riêng logic và hiển thị.
- Model.Bean: Chứa các thực thể (entity), gồm dữ liệu private, kèm phương thức get/set
- Model.Dao: Thực hiện các công việc lien quan đến cơ sở dữ liệu
	- Kết nối, lấy dữ liệu, truy vấn, chỉnh sửa, xóa dữ liệu trực tiếp với db
- Model.Bo: Truyền yêu cầu từ Servlet chuyển qua DAO, lấy dữ liệu từ DAO về cho Servlet. Ngoài ra còn xử lý các yêu cầu nghiệp vụ

## View
Lớp này chính là giao diện của ứng dụng

Có khả năng truy cập Model, truy xuát Model thông qua những hành vi mà Model cho phép nhưng View không thể thay đổi.

Đóng Session khi đã kết xuất HTML.

## Controller
Lớp này đóng vai trò quản lý và điều phối luồng hoạt động của ứng dụng

Hỗ trợ kết nối giữa model và view, giúp model xác định được view trình bỳ.

Là các Servlet, có nhiệm vụ nhận yêu cầu từ người dùng, đưa yêu cầu và nhận dữ liệu từ tầng Model, từ đó chuyển hướng và trả về cho View
