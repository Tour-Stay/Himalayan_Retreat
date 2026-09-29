import { Link } from 'react-router-dom';

const RoomCard = ({ room }) => {
  return (
    <div className="card-hover bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      {/* Room Image */}
      <div className="img-zoom h-56">
        <img
          src={room.imageURLs?.[0] || '/placeholder-room.jpg'}
          alt={room.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Room Info */}
      <div className="p-6">
        <h3 className="font-heading text-xl text-text-dark mb-2">{room.name}</h3>
        <p className="text-text-light text-sm leading-relaxed mb-4 line-clamp-2">
          {room.description}
        </p>

        {/* Capacity & Amenities */}
        <div className="flex items-center gap-3 text-xs text-text-light mb-4">
          <span className="flex items-center gap-1">
            👤 {room.capacity?.adults || 2} Adults
          </span>
          {room.capacity?.children > 0 && (
            <span className="flex items-center gap-1">
              👶 {room.capacity.children} Children
            </span>
          )}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-forest text-2xl font-bold">₹{room.pricePerNight?.toLocaleString()}</span>
            <span className="text-text-light text-xs ml-1">/ night</span>
          </div>
          <Link
            to={`/rooms/${room._id}`}
            className="bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-accent transition-colors duration-300"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
