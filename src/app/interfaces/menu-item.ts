export interface MenuItem {
  name: string;
  active: boolean;
  path?: any[] | string;
  isRouteExact?: boolean;
  children?: MenuItem[];
  iconName?: string;
}
