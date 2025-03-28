import { useNavigate } from "@/hooks/navigate";

export const CustomButton = ({ children, path }: { children : React.ReactNode, path: string }) => {
  const navigate = useNavigate();
  return <button onClick={() => {
    navigate(path)
  }}>
    {children}
  </button>
}