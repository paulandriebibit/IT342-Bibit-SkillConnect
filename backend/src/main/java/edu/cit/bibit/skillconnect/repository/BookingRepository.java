package edu.cit.bibit.skillconnect.repository;

import edu.cit.bibit.skillconnect.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find swaps where the student is the one requesting
    List<Booking> findByRequesterId(Long requesterId);

    // Find swaps where the student is the one providing (to accept/reject)
    List<Booking> findByProviderId(Long providerId);
}