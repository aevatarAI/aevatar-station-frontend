import { useOrgPermissions } from "@/hooks/useOrgPermissions";

export const useIsAdmin = () => {
    const { apiKeysCreate, apiKeysDelete, apiKeysEdit, organizationMembersManage,
      organizationsCreate, organizationsDelete, organizationsEdit
     } = useOrgPermissions();
  
  
    if ((apiKeysCreate && apiKeysDelete && apiKeysEdit) || 
    (organizationsCreate && organizationsDelete && organizationsEdit) || 
    organizationMembersManage
    ) {
      return true
    }
  
    return false
  }