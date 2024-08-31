import { useParams } from 'react-router-dom'
import StarRating from '../../components/uic/StarRating'
export default function Star() {
  const { id } = useParams()
  return (
    <div>
        <StarRating jobId={id} layout={'user'} userId={null}/>
    </div>
  )
}
