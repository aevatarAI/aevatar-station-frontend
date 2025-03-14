import { useQuery } from '@tanstack/react-query'
interface Content {
  organizeId: string;
  role: string;
}
export interface Notification {
  id: string;
  type: number;
  content: Content;
  status: string;
  creator: string;
  creatTime: number | string;
}

const mockData: Notification[] = [
  {
    id: "1",
    type: 0,
    content: {
      organizeId: "Aelf Organisation",
      role: "owner"
    },
    status: "0",
    creator: "Fred",
    creatTime: Date.now(),
  },
  {
    id: "2",
    type: 0,
    content: {
      organizeId: "Bitcoin Organisation",
      role: "owner"
    },
    status: "0",
    creator: "Phillip",
    creatTime: Date.now(),
  },
  {
    id: "3",
    type: 1,
    content: {
      organizeId: "DogeCoin Organisation",
      role: "owner"
    },
    status: "1",
    creator: "Min Xue",
    creatTime: Date.now(),
  },
  {
    id: "4",
    type: 1,
    content: {
      organizeId: "Ethereum Organisation",
      role: "owner"
    },
    status: "2",
    creator: "Cotton",
    creatTime: Date.now(),
  }
]

export const useGetNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => Promise.resolve(mockData)
  })
} 