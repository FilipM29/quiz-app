import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Quiz } from '../../models/quiz';

type Props = {
  quiz: Quiz;
};

export default function QuizCardCard({ quiz }: Props) {
  return (
    <Card sx={{ maxWidth: 345 }} elevation={3}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={
            quiz.pictureUrl ??
            'https://exoticdirect.co.uk/wp-content/uploads/2019/03/Bearded-Dragon-Info-Fact.png'
          }
          alt="quiz image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {quiz.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {quiz.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Play
        </Button>
      </CardActions>
    </Card>
  );
}
