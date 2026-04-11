package edu.cit.bibit.skillconnect.controller;

import edu.cit.bibit.skillconnect.model.Booking;
import edu.cit.bibit.skillconnect.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        // LOGIC: Check if requester is the provider
        if (booking.getRequesterId().equals(booking.getProviderId())) {
            return ResponseEntity.badRequest().body("Error: You cannot swap with yourself.");
        }

        Booking savedBooking = bookingRepository.save(booking);
        return ResponseEntity.status(201).body(savedBooking);
    }

    @GetMapping
    public ResponseEntity<?> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findAll());
    }
}