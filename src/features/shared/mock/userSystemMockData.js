export const mockVehicles = [
  {
    id: "1",
    name: "Hyundai i20 Magna",
    type: "Car",
    plate: "DL1CS3305",
    fuel: "Petrol",
    year: "2019",
    ownership: "First Owner",
    insuranceStatus: "Active",
    pucStatus: "Expired",
    image: "/Car Image.png",
    qrId: "QR-DV-1001",
  },
  {
    id: "2",
    name: "Suzuki Hayabusa",
    type: "Bike",
    plate: "HR07RS0987",
    fuel: "Petrol",
    year: "2022",
    ownership: "First Owner",
    insuranceStatus: "Expired",
    pucStatus: "Expired",
    image: "/Bike Image.png",
    qrId: "QR-DV-1002",
  },
];

export const mockNotifications = [
  {
    id: "n1",
    title: "Vehicle scanned in no parking area",
    description: "Your vehicle DL1CS3305 was scanned for no-parking alert.",
    time: "2 min ago",
    type: "warning",
    unread: true,
  },
  {
    id: "n2",
    title: "Emergency contact request",
    description: "A user initiated emergency connect for your QR profile.",
    time: "35 min ago",
    type: "critical",
    unread: true,
  },
  {
    id: "n3",
    title: "Insurance reminder",
    description: "Insurance for HR07RS0987 expires in 3 days.",
    time: "1 day ago",
    type: "info",
    unread: false,
  },
];

export const mockProfile = {
  id: "u1",
  firstName: "Rajat",
  lastName: "Sharma",
  name: "Rajat Sharma",
  phone: "+91 9897000001",
  email: "rajat@example.com",
  address: "Haridwar, Uttarakhand",
  occupation: "IT / Software",
  avatar: "https://randomuser.me/api/portraits/men/75.jpg",
};

export const mockEmergencyContacts = [
  {
    id: "e1",
    name: "Aman Sharma",
    relation: "Brother",
    phone: "+91 9811100011",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "e2",
    name: "Pooja Sharma",
    relation: "Spouse",
    phone: "+91 9811100022",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

export const mockOrders = [
  {
    id: "o1",
    item: "Physical Smart QR",
    status: "In Transit",
    date: "08 Apr 2026",
    amount: 199,
  },
  {
    id: "o2",
    item: "Replacement QR Kit",
    status: "Delivered",
    date: "30 Mar 2026",
    amount: 149,
  },
];
