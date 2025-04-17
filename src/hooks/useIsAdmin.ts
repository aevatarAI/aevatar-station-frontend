import { useOrgPermissions } from "@/hooks/useOrgPermissions";

export const useIsAdmin = () => {
    const { apiKeysCreate, apiKeysDelete, apiKeysEdit, 
      organizationMembersManage, organizationsCreate, organizationsDelete, organizationsEdit, 
      projectsCreate, projectsEdit, projectsDelete
     } = useOrgPermissions();
  
  
    // [TODO] - 
    if ((apiKeysCreate && apiKeysDelete && apiKeysEdit) || 
    (projectsCreate && projectsEdit && projectsDelete) ||
    (organizationsCreate && organizationsDelete && organizationsEdit) || 
    organizationMembersManage
    ) {
      return true // admin -> create + manage
    }
  
    return false
  }