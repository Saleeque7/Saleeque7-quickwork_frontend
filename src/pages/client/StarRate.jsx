
import { useParams } from 'react-router-dom'
import StarRating from '../../components/uic/StarRating'
export default function StarRate() {
  const { id ,jobId } = useParams()
  return (
    <div>
        <StarRating jobId={jobId} layout={'client'} userId={id} />
    </div>
  )
}
