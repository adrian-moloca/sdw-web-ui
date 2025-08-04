import { List, ListItem, ListItemText, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { humanizeAttribute } from './humanize-attribute';

const renderXMLHeader = (value: string) => {
  if (value === 'CHighlights') {
    return (
      <Typography variant="h4" color={'primary'} sx={{ marginTop: 2 }}>
        Highlights
      </Typography>
    );
  } else if (value === 'GInterest') {
    return (
      <Typography variant="h4" color={'primary'} sx={{ marginTop: 2 }}>
        Interests
      </Typography>
    );
  }

  return <Typography variant="h6">{humanizeAttribute(value)}</Typography>;
};

export const renderXmlData = (data: any) => {
  if (!data) return null;

  return Object.entries(data).map(([key, value]) => {
    if (typeof value === 'object' && !Array.isArray(value)) {
      if (key === '_attributes' && value) {
        const numItems = Object.entries(value).length;

        return (
          <Grid container spacing={2} key={key}>
            {Object.entries(value).map(([attrKey, attrValue]: [string, any]) => (
              <Grid size={{ xs: 6, md: 3, lg: 3 }} key={attrKey}>
                <Typography variant="subtitle1" component="span">
                  {humanizeAttribute(attrKey)}{' '}
                </Typography>
                {numItems > 4 ? (
                  <Typography variant="body1">{attrValue}</Typography>
                ) : (
                  <Typography variant="body1" component={'span'}>
                    {attrValue}
                  </Typography>
                )}
              </Grid>
            ))}
          </Grid>
        );
      }
      return (
        <div key={key}>
          {renderXMLHeader(key)}
          {renderXmlData(value)}
        </div>
      );
    } else if (Array.isArray(value)) {
      return (
        <div key={key} style={{ marginLeft: 10 }}>
          {renderXMLHeader(key)}
          <List style={{ marginLeft: 10 }} tabIndex={0}>
            {value.map((item: any, index: number) => (
              <ListItem key={index} disablePadding>
                <ListItemText primary={renderXmlData(item)} />
              </ListItem>
            ))}
          </List>
        </div>
      );
    } else if (key === '_cdata') {
      return (
        <div key={key}>
          <div
            className="xml-viewer"
            dangerouslySetInnerHTML={{ __html: value?.toString() ?? '' }}
          />
        </div>
      );
    }
    return (
      <div key={key}>
        <Typography variant="subtitle1">{key}:</Typography>
        <Typography variant="body1">{value?.toString() ?? ''}</Typography>
      </div>
    );
  });
};
