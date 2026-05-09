package edu.cit.bibit.skillconnect.repository;

import edu.cit.bibit.skillconnect.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByRequesterId(Long requesterId);
    List<Booking> findByProviderId(Long providerId);
    
    // Add this method
    List<Booking> findByRequesterIdOrProviderId(Long requesterId, Long providerId);
}
