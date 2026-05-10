package edu.cit.bibit.skillconnect.features.bookings;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    // This derived query captures all activity for a specific User ID
    List<Booking> findByRequesterIdOrProviderId(Long requesterId, Long providerId);
}