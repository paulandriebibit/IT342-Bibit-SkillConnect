package edu.cit.bibit.skillconnect.features.bookings;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.bibit.skillconnect.features.auth.NotificationController;

@RestController
@RequestMapping("/api/v1/bookings")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        if (Objects.equals(booking.getRequesterId(), booking.getProviderId())) {
            return ResponseEntity.badRequest().body("Error: You cannot swap with yourself.");
        }
        Booking savedBooking = bookingRepository.save(booking);

        Map<String, Object> notification = new HashMap<>();
        notification.put("bookingId", savedBooking.getId());
        notification.put("message", "New swap request from " + savedBooking.getRequesterName() + " for your skill: " + savedBooking.getSkillTitle());
        notification.put("type", "SWAP_REQUEST");

        NotificationController.sendRealTimeNotification(savedBooking.getProviderId(), notification);

        return ResponseEntity.status(201).body(savedBooking);
    }

    @GetMapping("/my-bookings/{userId}")
    public ResponseEntity<?> getMyBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingRepository.findByRequesterIdOrProviderId(userId, userId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long id, @RequestBody Map<String, String> statusData) {
        Optional<Booking> bookingOptional = bookingRepository.findById(id);
        if (bookingOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Booking record not found"));
        }

        String newStatus = statusData.get("status");
        Booking booking = bookingOptional.get();
        booking.setStatus(newStatus.toUpperCase().trim());
        Booking updatedBooking = bookingRepository.save(booking);

        Map<String, Object> alert = new HashMap<>();
        alert.put("bookingId", updatedBooking.getId());
        alert.put("type", "STATUS_UPDATE");
        
        if ("CANCELLED".equals(updatedBooking.getStatus())) {
            alert.put("message", updatedBooking.getProviderName() + " declined your swap request for: " + updatedBooking.getSkillTitle());
            NotificationController.sendRealTimeNotification(updatedBooking.getRequesterId(), alert);
        } else if ("CONFIRMED".equals(updatedBooking.getStatus())) {
            alert.put("message", updatedBooking.getProviderName() + " accepted your swap request for: " + updatedBooking.getSkillTitle());
            NotificationController.sendRealTimeNotification(updatedBooking.getRequesterId(), alert);
        }

        return ResponseEntity.ok(updatedBooking);
    }
}