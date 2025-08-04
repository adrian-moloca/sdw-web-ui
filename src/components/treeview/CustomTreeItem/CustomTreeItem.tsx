import { alpha, styled } from '@mui/material/styles';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';

export const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    padding: theme.spacing(0.2, 0.2),
    margin: theme.spacing(0.2, 0),
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 10,
    paddingLeft: 10,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
  lineHeight: 1,
}));
