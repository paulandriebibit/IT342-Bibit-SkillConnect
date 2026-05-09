package edu.cit.bibit.skillconnect.controller;

import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.bibit.skillconnect.model.Booking;
import edu.cit.bibit.skillconnect.repository.BookingRepository;

@RestController
@RequestMapping("/api/v1/bookings")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        // LOGIC: Check if requester is the provider
        if (Objects.equals(booking.getRequesterId(), booking.getProviderId())) {
            return ResponseEntity.badRequest().body("Error: You cannot swap with yourself.");
        }

        // Log the received data
        System.out.println("Received booking - Requester ID: " + booking.getRequesterId());
        System.out.println("Received booking - Provider ID: " + booking.getProviderId());
        System.out.println("Received booking - Skill ID: " + booking.getSkillId());

        Booking savedBooking = bookingRepository.save(booking);
        return ResponseEntity.status(201).body(savedBooking);
    }

    @GetMapping("/my-bookings/{userId}")
    public ResponseEntity<?> getMyBookings(@PathVariable Long userId) {
        List<Booking> myBookings = bookingRepository.findByRequesterIdOrProviderId(userId, userId);
        return ResponseEntity.ok(myBookings);
    }
}